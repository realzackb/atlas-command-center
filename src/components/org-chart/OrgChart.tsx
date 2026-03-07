import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Bot, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrgNodeCard } from "./OrgNodeCard";
import { AddAgentDialog } from "./AddAgentDialog";
import { EditAgentDialog } from "./EditAgentDialog";
import type { OrgNode } from "./types";

const defaultNodes: OrgNode[] = [
  {
    id: "atlas",
    name: "Atlas",
    role: "Primary Orchestrator",
    description: "Master agent coordinating all sub-agents via OpenClaw on Mac Mini",
    team: "core",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "ClickUp", "Google Drive", "Google Calendar"],
    guardrails: ["No deletion of files", "Requires approval for emails"],
    tasksCompleted: 142,
    parentId: null,
  },
  {
    id: "personal",
    name: "Personal Assistant",
    role: "Health & Wellness Advisor",
    description: "Fitness research, testosterone coaching, sexual wellness, health tracking",
    team: "personal",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "ClickUp (Personal)"],
    guardrails: ["Read-only Google Drive", "Personal ClickUp only"],
    tasksCompleted: 67,
    parentId: "atlas",
  },
  {
    id: "business",
    name: "Business Executive",
    role: "Business Operations Manager",
    description: "Email drafting, ad scripts, content creation, business task management",
    team: "business",
    status: "online",
    tools: ["Claude", "Grok", "ClickUp (Business)", "Google Drive (Full)"],
    guardrails: ["No financial transactions", "Email drafts require review"],
    tasksCompleted: 89,
    parentId: "atlas",
  },
];

const STORAGE_KEY = "atlas-org-chart-nodes";

function loadNodes(): OrgNode[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultNodes;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function OrgChart() {
  const [nodes, setNodes] = useState<OrgNode[]>(loadNodes);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  }, [nodes]);


    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getChildren = useCallback(
    (parentId: string) => nodes.filter((n) => n.parentId === parentId),
    [nodes]
  );

  const root = nodes.find((n) => n.parentId === null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const draggedId = active.id as string;
    const overId = over.id as string;
    const dragged = nodes.find((n) => n.id === draggedId);

    // Don't allow root to be moved
    if (!dragged || dragged.parentId === null) return;

    // Don't allow dropping onto own descendants
    const isDescendant = (parentId: string, checkId: string): boolean => {
      const children = nodes.filter((n) => n.parentId === parentId);
      return children.some((c) => c.id === checkId || isDescendant(c.id, checkId));
    };
    if (isDescendant(draggedId, overId)) return;

    // Re-parent the dragged node under the over node
    setNodes((prev) =>
      prev.map((n) => (n.id === draggedId ? { ...n, parentId: overId } : n))
    );
  };

  const addAgent = (agent: Omit<OrgNode, "id">) => {
    setNodes((prev) => [...prev, { ...agent, id: `agent-${Date.now()}` }]);
  };

  const deleteAgent = (id: string) => {
    // Re-parent children to the deleted node's parent
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setNodes((prev) =>
      prev
        .filter((n) => n.id !== id)
        .map((n) => (n.parentId === id ? { ...n, parentId: node.parentId } : n))
    );
  };

  const updateAgent = (updated: OrgNode) => {
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setEditingNode(null);
  };

  const activeNode = activeId ? nodes.find((n) => n.id === activeId) : null;

  const renderTree = (nodeId: string, isRoot = false): React.ReactNode => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    const children = getChildren(nodeId);

    return (
      <OrgNodeCard
        key={node.id}
        node={node}
        isRoot={isRoot}
        onEdit={setEditingNode}
        onDelete={deleteAgent}
      >
        {children.length > 0
          ? children.map((child) => renderTree(child.id))
          : undefined}
      </OrgNodeCard>
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Org Chart Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag agents to restructure your AI workforce hierarchy
          </p>
        </div>
        <AddAgentDialog agents={nodes} onAdd={addAgent} />
      </motion.div>

      <motion.div variants={item} className="glass-card p-8 glow-blue overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
            <div className="flex justify-center min-w-fit">
              {root && renderTree(root.id, true)}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeNode && (
              <div className="glass-card p-4 w-60 glow-blue ring-1 ring-primary/50">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-2">
                    {activeNode.parentId === null ? (
                      <Zap className="h-5 w-5 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-foreground">{activeNode.name}</span>
                  <span className="text-[10px] text-muted-foreground">{activeNode.role}</span>
                  <Badge variant="outline" className="mt-2 text-[10px]">{activeNode.team}</Badge>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </motion.div>

      {editingNode && (
        <EditAgentDialog
          node={editingNode}
          agents={nodes}
          onSave={updateAgent}
          onClose={() => setEditingNode(null)}
        />
      )}
    </motion.div>
  );
}

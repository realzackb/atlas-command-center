import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bot, GripVertical, Pencil, Trash2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { OrgNode } from "./types";

interface OrgNodeCardProps {
  node: OrgNode;
  children?: React.ReactNode;
  onEdit: (node: OrgNode) => void;
  onDelete: (id: string) => void;
  isRoot?: boolean;
}

export function OrgNodeCard({ node, children, onEdit, onDelete, isRoot }: OrgNodeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const statusColor =
    node.status === "online"
      ? "bg-atlas-success"
      : node.status === "idle"
      ? "bg-atlas-warning"
      : "bg-muted-foreground";

  return (
    <div className="flex flex-col items-center" ref={setNodeRef} style={style}>
      {/* Connector line from parent */}
      {!isRoot && <div className="h-6 w-px bg-primary/30" />}

      <div
        className={`glass-card p-4 w-60 relative group transition-all ${
          isDragging ? "glow-blue ring-1 ring-primary/50" : "hover:border-primary/30"
        }`}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(node)}>
            <Pencil className="h-3 w-3" />
          </Button>
          {!isRoot && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(node.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-2 text-lg">
            {node.emoji ? (
              <span>{node.emoji}</span>
            ) : isRoot ? (
              <Zap className="h-5 w-5 text-primary" />
            ) : (
              <Bot className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-foreground">{node.name}</span>
            <div className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
          </div>
          <span className="text-[10px] text-muted-foreground">{node.role}</span>
          {node.rolePrompt && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[9px] text-primary/70 cursor-help mt-1 line-clamp-2 max-w-[200px]">
                    {node.description}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm text-xs leading-relaxed">
                  <p className="font-semibold mb-1">Role Prompt:</p>
                  <p>{node.rolePrompt}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className="flex gap-1 mt-2 flex-wrap justify-center">
            <Badge variant="outline" className="text-[10px]">{node.team}</Badge>
            <Badge variant="secondary" className="text-[10px]">{node.tasksCompleted} tasks</Badge>
          </div>
        </div>
      </div>

      {/* Children */}
      {children && (
        <>
          <div className="h-6 w-px bg-primary/30" />
          <div className="flex gap-6 relative">
            {/* Horizontal connector */}
            {Array.isArray(children) && (children as React.ReactNode[]).length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-primary/30" style={{ width: "calc(100% - 15rem)" }} />
            )}
            {children}
          </div>
        </>
      )}
    </div>
  );
}

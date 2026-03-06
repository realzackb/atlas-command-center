import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Plus,
  Settings,
  Zap,
  Shield,
  Search as SearchIcon,
  Mail,
  FileText,
  ListTodo,
  Brain,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  team: "personal" | "business";
  status: "online" | "offline" | "idle";
  tools: string[];
  guardrails: string[];
  tasksCompleted: number;
  lastActive: string;
}

const initialAgents: Agent[] = [
  {
    id: "1",
    name: "Atlas",
    role: "Primary Orchestrator",
    description: "Master agent coordinating all sub-agents via OpenClaw on Mac Mini",
    team: "business",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "ClickUp", "Google Drive", "Google Calendar"],
    guardrails: ["No deletion of files", "Requires approval for emails"],
    tasksCompleted: 142,
    lastActive: "Active now",
  },
  {
    id: "2",
    name: "Personal Assistant",
    role: "Health & Wellness Advisor",
    description: "Fitness research, testosterone coaching, sexual wellness, health tracking",
    team: "personal",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "ClickUp (Personal)"],
    guardrails: ["Read-only Google Drive", "Personal ClickUp only"],
    tasksCompleted: 67,
    lastActive: "5 min ago",
  },
  {
    id: "3",
    name: "Business Executive",
    role: "Business Operations Manager",
    description: "Email drafting, ad scripts, content creation, business task management",
    team: "business",
    status: "online",
    tools: ["Claude", "Grok", "ClickUp (Business)", "Google Drive (Full)"],
    guardrails: ["No financial transactions", "Email drafts require review"],
    tasksCompleted: 89,
    lastActive: "1 min ago",
  },
];

const availableTools = ["Grok", "Brave", "Claude", "ClickUp (Personal)", "ClickUp (Business)", "Google Drive (Read-Only)", "Google Drive (Full)", "Google Calendar"];

const toolIcons: Record<string, React.ElementType> = {
  Grok: Brain,
  Brave: SearchIcon,
  Claude: Bot,
  "ClickUp (Personal)": ListTodo,
  "ClickUp (Business)": ListTodo,
  "Google Drive (Read-Only)": FileText,
  "Google Drive (Full)": FileText,
  "Google Calendar": Mail,
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    role: "",
    description: "",
    team: "business" as "personal" | "business",
    tools: [] as string[],
  });

  const toggleTool = (tool: string) => {
    setNewAgent((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const createAgent = () => {
    if (!newAgent.name || !newAgent.role) return;
    const agent: Agent = {
      id: Date.now().toString(),
      ...newAgent,
      status: "offline",
      guardrails: [],
      tasksCompleted: 0,
      lastActive: "Never",
    };
    setAgents((prev) => [...prev, agent]);
    setNewAgent({ name: "", role: "", description: "", team: "business", tools: [] });
    setDialogOpen(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Council</h1>
          <p className="text-sm text-muted-foreground mt-1">Build, manage, and monitor your AI agents</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Agent name" value={newAgent.name} onChange={(e) => setNewAgent((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input placeholder="e.g., Content Strategist" value={newAgent.role} onChange={(e) => setNewAgent((p) => ({ ...p, role: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="What does this agent do?" value={newAgent.description} onChange={(e) => setNewAgent((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Team</Label>
                <div className="flex gap-2">
                  {(["personal", "business"] as const).map((t) => (
                    <Button key={t} variant={newAgent.team === t ? "default" : "outline"} size="sm" onClick={() => setNewAgent((p) => ({ ...p, team: t }))}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tools</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTools.map((tool) => (
                    <Badge
                      key={tool}
                      variant={newAgent.tools.includes(tool) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTool(tool)}
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={createAgent}>Create Agent</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Org Hierarchy */}
      <motion.div variants={item} className="glass-card p-6 glow-blue">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Organization Hierarchy</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="glass-card p-4 border-primary/30 w-64 text-center">
            <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-sm font-bold text-foreground">Atlas</div>
            <div className="text-[10px] text-muted-foreground">Primary Orchestrator • OpenClaw</div>
          </div>
          <div className="h-6 w-px bg-primary/30" />
          <div className="flex gap-8">
            {agents.filter((a) => a.name !== "Atlas").map((agent) => (
              <div key={agent.id} className="glass-card p-4 w-56 text-center">
                <Bot className="h-4 w-4 text-primary mx-auto mb-2" />
                <div className="text-sm font-semibold text-foreground">{agent.name}</div>
                <div className="text-[10px] text-muted-foreground">{agent.role}</div>
                <Badge variant="outline" className="mt-2 text-[10px]">{agent.team}</Badge>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <motion.div key={agent.id} variants={item} className="glass-card p-5 hover:border-primary/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{agent.name}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${agent.status === "online" ? "bg-atlas-success" : agent.status === "idle" ? "bg-atlas-warning" : "bg-muted-foreground"}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{agent.role}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{agent.description}</p>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Tools</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-[10px]">{tool}</Badge>
                  ))}
                </div>
              </div>
              {agent.guardrails.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Guardrails
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.guardrails.map((g) => (
                      <Badge key={g} variant="outline" className="text-[10px] text-atlas-warning border-atlas-warning/30">{g}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground">{agent.tasksCompleted} tasks completed</span>
                <span className="text-[10px] text-muted-foreground">{agent.lastActive}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

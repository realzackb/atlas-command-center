import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrgNode } from "./types";

const availableTools = [
  "Grok", "Brave", "Claude", "ClickUp (Personal)",
  "ClickUp (Business)", "Google Drive (Read-Only)",
  "Google Drive (Full)", "Google Calendar",
];

interface AddAgentDialogProps {
  agents: OrgNode[];
  onAdd: (agent: Omit<OrgNode, "id">) => void;
}

export function AddAgentDialog({ agents, onAdd }: AddAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    rolePrompt: "",
    team: "business" as OrgNode["team"],
    parentId: agents[0]?.id ?? null,
    tools: [] as string[],
    emoji: "🤖",
  });

  const toggleTool = (tool: string) =>
    setForm((p) => ({
      ...p,
      tools: p.tools.includes(tool) ? p.tools.filter((t) => t !== tool) : [...p.tools, tool],
    }));

  const submit = () => {
    if (!form.name || !form.role) return;
    onAdd({
      name: form.name,
      role: form.role,
      description: form.description,
      rolePrompt: form.rolePrompt,
      team: form.team,
      parentId: form.parentId,
      status: "offline",
      tools: form.tools,
      guardrails: [],
      tasksCompleted: 0,
      emoji: form.emoji,
    });
    setForm({ name: "", role: "", description: "", rolePrompt: "", team: "business", parentId: agents[0]?.id ?? null, tools: [], emoji: "🤖" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Agent to Org Chart</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-[4rem_1fr] gap-4">
            <div className="space-y-2">
              <Label>Emoji</Label>
              <Input className="text-center text-lg" value={form.emoji} onChange={(e) => setForm((p) => ({ ...p, emoji: e.target.value }))} maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Agent name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input placeholder="e.g., Content Strategist" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="What does this agent do?" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={form.team} onValueChange={(v) => setForm((p) => ({ ...p, team: v as OrgNode["team"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reports To</Label>
              <Select value={form.parentId ?? ""} onValueChange={(v) => setForm((p) => ({ ...p, parentId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tools</Label>
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <Badge
                  key={tool}
                  variant={form.tools.includes(tool) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTool(tool)}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={submit}>Add Agent</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

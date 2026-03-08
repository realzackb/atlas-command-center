import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface EditAgentDialogProps {
  node: OrgNode;
  agents: OrgNode[];
  onSave: (node: OrgNode) => void;
  onClose: () => void;
}

export function EditAgentDialog({ node, agents, onSave, onClose }: EditAgentDialogProps) {
  const [form, setForm] = useState({ ...node });

  const toggleTool = (tool: string) =>
    setForm((p) => ({
      ...p,
      tools: p.tools.includes(tool) ? p.tools.filter((t) => t !== tool) : [...p.tools, tool],
    }));

  const possibleParents = agents.filter((a) => a.id !== node.id);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {node.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-[4rem_1fr] gap-4">
            <div className="space-y-2">
              <Label>Emoji</Label>
              <Input className="text-center text-lg" value={form.emoji || ""} onChange={(e) => setForm((p) => ({ ...p, emoji: e.target.value }))} maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
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
                </SelectContent>
              </Select>
            </div>
            {form.parentId !== null && (
              <div className="space-y-2">
                <Label>Reports To</Label>
                <Select value={form.parentId ?? ""} onValueChange={(v) => setForm((p) => ({ ...p, parentId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {possibleParents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as OrgNode["status"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
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
          <Button className="w-full" onClick={() => onSave(form)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

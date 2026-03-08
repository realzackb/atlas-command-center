export interface OrgNode {
  id: string;
  name: string;
  role: string;
  description: string;
  team: "personal" | "business" | "core";
  status: "online" | "offline" | "idle";
  tools: string[];
  guardrails: string[];
  tasksCompleted: number;
  parentId: string | null;
  emoji?: string;
}

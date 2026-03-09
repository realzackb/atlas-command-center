export interface OrgNode {
  id: string;
  name: string;
  role: string;
  description: string;
  rolePrompt: string;
  team: "personal" | "business" | "core" | "media" | "content" | "research" | "ops" | "sales";
  status: "online" | "offline" | "idle";
  tools: string[];
  guardrails: string[];
  tasksCompleted: number;
  parentId: string | null;
  emoji?: string;
}

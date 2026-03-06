import { useState } from "react";
import { motion } from "framer-motion";
import { ListTodo, Plus, Filter, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Task {
  id: string;
  title: string;
  agent: string;
  workspace: "personal" | "business";
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
}

const mockTasks: Task[] = [
  { id: "1", title: "Research testosterone optimization protocols", agent: "Personal Assistant", workspace: "personal", status: "in_progress", priority: "high", dueDate: "Today" },
  { id: "2", title: "Draft Q1 campaign ad script", agent: "Business Executive", workspace: "business", status: "in_progress", priority: "urgent", dueDate: "Today" },
  { id: "3", title: "Compile fitness supplement research", agent: "Personal Assistant", workspace: "personal", status: "todo", priority: "medium", dueDate: "Tomorrow" },
  { id: "4", title: "Write client onboarding email sequence", agent: "Business Executive", workspace: "business", status: "todo", priority: "high", dueDate: "Mar 8" },
  { id: "5", title: "Generate YouTube video script ideas", agent: "Business Executive", workspace: "business", status: "done", priority: "medium", dueDate: "Mar 5" },
  { id: "6", title: "Update health tracking dashboard data", agent: "Personal Assistant", workspace: "personal", status: "done", priority: "low", dueDate: "Mar 4" },
  { id: "7", title: "Research competitor ad strategies", agent: "Business Executive", workspace: "business", status: "todo", priority: "high", dueDate: "Mar 9" },
  { id: "8", title: "Create short-form content calendar", agent: "Business Executive", workspace: "business", status: "in_progress", priority: "medium", dueDate: "Mar 7" },
];

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground border-muted-foreground/30",
  medium: "text-primary border-primary/30",
  high: "text-atlas-warning border-atlas-warning/30",
  urgent: "text-destructive border-destructive/30",
};

const statusIcons: Record<string, React.ElementType> = {
  todo: AlertCircle,
  in_progress: Clock,
  done: CheckCircle2,
};

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function Tasks() {
  const [workspace, setWorkspace] = useState<"all" | "personal" | "business">("all");

  const filtered = mockTasks.filter((t) => workspace === "all" || t.workspace === workspace);

  const byStatus = (status: string) => filtered.filter((t) => t.status === status);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
          <p className="text-sm text-muted-foreground mt-1">ClickUp tasks across personal & business workspaces</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={workspace} onValueChange={(v) => setWorkspace(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Kanban-style columns */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["todo", "in_progress", "done"] as const).map((status) => {
          const StatusIcon = statusIcons[status];
          const tasks = byStatus(status);
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <StatusIcon className={`h-4 w-4 ${status === "done" ? "text-atlas-success" : status === "in_progress" ? "text-primary" : "text-muted-foreground"}`} />
                {statusLabels[status]}
                <Badge variant="secondary" className="text-[10px] ml-auto">{tasks.length}</Badge>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="glass-card p-3 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="text-sm font-medium text-foreground mb-2">{task.title}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{task.workspace}</Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                      <ArrowRight className="h-2.5 w-2.5" />
                      {task.agent}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

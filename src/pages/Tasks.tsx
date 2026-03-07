import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, Clock, AlertCircle, Eye, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "backlog" | "in_progress" | "review" | "done";
type Priority = "low" | "medium" | "high" | "urgent";

interface Task {
  id: string;
  title: string;
  description?: string;
  agent: string;
  status: Status;
  priority: Priority;
  dueDate: string;
}

const STORAGE_KEY = "atlas-tasks";

const defaultTasks: Task[] = [
  { id: "1", title: "Research testosterone optimization protocols", agent: "Personal Assistant", status: "in_progress", priority: "high", dueDate: "Today" },
  { id: "2", title: "Draft Q1 campaign ad script", agent: "Business Executive", status: "in_progress", priority: "urgent", dueDate: "Today" },
  { id: "3", title: "Compile fitness supplement research", agent: "Personal Assistant", status: "backlog", priority: "medium", dueDate: "Tomorrow" },
  { id: "4", title: "Write client onboarding email sequence", agent: "Business Executive", status: "backlog", priority: "high", dueDate: "Mar 8" },
  { id: "5", title: "Generate YouTube video script ideas", agent: "Business Executive", status: "done", priority: "medium", dueDate: "Mar 5" },
  { id: "6", title: "Update health tracking dashboard data", agent: "Personal Assistant", status: "done", priority: "low", dueDate: "Mar 4" },
  { id: "7", title: "Research competitor ad strategies", agent: "Business Executive", status: "review", priority: "high", dueDate: "Mar 9" },
  { id: "8", title: "Create short-form content calendar", agent: "Business Executive", status: "review", priority: "medium", dueDate: "Mar 7" },
];

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultTasks;
}

const columns: { key: Status; label: string; icon: React.ElementType; color: string }[] = [
  { key: "backlog", label: "Backlog", icon: AlertCircle, color: "text-muted-foreground" },
  { key: "in_progress", label: "In Progress", icon: Clock, color: "text-primary" },
  { key: "review", label: "Review", icon: Eye, color: "text-atlas-warning" },
  { key: "done", label: "Done", icon: CheckCircle2, color: "text-atlas-success" },
];

const priorityColors: Record<Priority, string> = {
  low: "text-muted-foreground border-muted-foreground/30",
  medium: "text-primary border-primary/30",
  high: "text-atlas-warning border-atlas-warning/30",
  urgent: "text-destructive border-destructive/30",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [addOpen, setAddOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", agent: "", priority: "medium" as Priority, dueDate: "", status: "backlog" as Status });

  const save = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = { ...newTask, id: crypto.randomUUID() };
    save([...tasks, task]);
    setNewTask({ title: "", description: "", agent: "", priority: "medium", dueDate: "", status: "backlog" });
    setAddOpen(false);
  };

  const deleteTask = (id: string) => save(tasks.filter((t) => t.id !== id));

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    if (!draggedId) return;
    save(tasks.map((t) => (t.id === draggedId ? { ...t, status } : t)));
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-full">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Board</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage tasks across your AI workforce</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          const ColIcon = col.icon;
          return (
            <div
              key={col.key}
              className="space-y-3 min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ColIcon className={`h-4 w-4 ${col.color}`} />
                {col.label}
                <Badge variant="secondary" className="text-[10px] ml-auto">{colTasks.length}</Badge>
              </div>
              <div className="space-y-2">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`glass-card p-3 cursor-grab active:cursor-grabbing transition-all hover:border-primary/30 ${draggedId === task.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground mb-2">{task.title}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[10px] ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                        </div>
                        {task.agent && (
                          <div className="text-[10px] text-muted-foreground mt-2">{task.agent}</div>
                        )}
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Optional description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agent</Label>
                <Input value={newTask.agent} onChange={(e) => setNewTask({ ...newTask, agent: e.target.value })} placeholder="Assigned agent" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} placeholder="e.g. Tomorrow" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Column</Label>
                <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v as Status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

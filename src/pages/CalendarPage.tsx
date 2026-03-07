import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Zap, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CronJob {
  id: string;
  name: string;
  time: string; // HH:mm
  days: number[]; // 0=Sun..6=Sat
  color: string;
  alwaysRunning?: boolean;
  frequency?: string;
}

const STORAGE_KEY = "atlas-cron-jobs";

const jobColors = [
  "bg-destructive/80 text-destructive-foreground",
  "bg-primary/80 text-primary-foreground",
  "bg-atlas-success/80 text-foreground",
  "bg-atlas-warning/80 text-foreground",
  "bg-[hsl(var(--atlas-cyan))]/80 text-foreground",
  "bg-purple-600/80 text-foreground",
  "bg-orange-600/80 text-foreground",
];

const defaultJobs: CronJob[] = [
  { id: "1", name: "Trend Radar", time: "12:00", days: [0,1,2,3,4,5,6], color: jobColors[0], alwaysRunning: true, frequency: "5x daily" },
  { id: "2", name: "Morning Kickoff", time: "06:55", days: [0,1,2,3,4,5,6], color: jobColors[2] },
  { id: "3", name: "YouTube OpenClaw Research", time: "07:00", days: [0,1,2,3,4,5,6], color: jobColors[3] },
  { id: "4", name: "Scout Morning Research", time: "08:00", days: [0,1,2,3,4,5,6], color: jobColors[0] },
  { id: "5", name: "Morning Brief", time: "08:00", days: [0,1,2,3,4,5,6], color: jobColors[0] },
  { id: "6", name: "Daily Digest", time: "09:00", days: [0,1,2,3,4,5,6], color: jobColors[1] },
  { id: "7", name: "Evening Wrap Up", time: "21:00", days: [0,1,2,3,4,5,6], color: jobColors[2] },
  { id: "8", name: "Quill Script Writer", time: "08:30", days: [0,1,2,3,4,5,6], color: jobColors[4] },
  { id: "9", name: "Reaction Poller", time: "00:00", days: [], color: jobColors[5], alwaysRunning: true, frequency: "Every 5 min" },
  { id: "10", name: "Opportunity Scanner", time: "00:00", days: [], color: jobColors[6], alwaysRunning: true, frequency: "6x daily" },
];

function loadJobs(): CronJob[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultJobs;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function CalendarPage() {
  const [jobs, setJobs] = useState<CronJob[]>(loadJobs);
  const [addOpen, setAddOpen] = useState(false);
  const [newJob, setNewJob] = useState({ name: "", time: "08:00", days: [1,2,3,4,5] as number[], color: jobColors[0], alwaysRunning: false, frequency: "" });

  const today = new Date().getDay();

  const save = (updated: CronJob[]) => {
    setJobs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addJob = () => {
    if (!newJob.name.trim()) return;
    save([...jobs, { ...newJob, id: crypto.randomUUID() }]);
    setNewJob({ name: "", time: "08:00", days: [1,2,3,4,5], color: jobColors[0], alwaysRunning: false, frequency: "" });
    setAddOpen(false);
  };

  const deleteJob = (id: string) => save(jobs.filter((j) => j.id !== id));

  const toggleDay = (day: number) => {
    setNewJob((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const alwaysRunning = jobs.filter((j) => j.alwaysRunning);
  const scheduledJobs = jobs.filter((j) => !j.alwaysRunning);

  const getJobsForDay = (dayIndex: number) =>
    scheduledJobs
      .filter((j) => j.days.includes(dayIndex))
      .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-full">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scheduled Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Your automated routines</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <CalendarDays className="h-3 w-3" /> Week
          </Badge>
          <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> New Job
          </Button>
        </div>
      </motion.div>

      {/* Always Running */}
      {alwaysRunning.length > 0 && (
        <motion.div variants={item} className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Zap className="h-4 w-4 text-atlas-warning" />
            Always Running
          </div>
          <div className="flex flex-wrap gap-2">
            {alwaysRunning.map((job) => (
              <div key={job.id} className="group relative">
                <Badge variant="outline" className="text-xs py-1 px-3 gap-1.5">
                  {job.name}
                  {job.frequency && <span className="text-muted-foreground">• {job.frequency}</span>}
                </Badge>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground items-center justify-center text-[8px] hidden group-hover:flex"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Calendar */}
      <motion.div variants={item} className="glass-card overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-border">
          {DAY_NAMES.map((day, i) => (
            <div key={day} className="min-w-0">
              <div className={`p-3 text-sm font-semibold border-b border-border ${i === today ? "text-primary" : "text-foreground"}`}>
                {day}
              </div>
              <div className="p-2 space-y-1.5 min-h-[400px]">
                {getJobsForDay(i).map((job) => (
                  <div
                    key={job.id}
                    className={`group relative rounded-md p-2 text-[11px] ${job.color} cursor-default`}
                  >
                    <div className="font-medium truncate">{job.name}</div>
                    <div className="opacity-70">{job.time.replace(/^0/, "")}</div>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="absolute top-1 right-1 h-4 w-4 rounded-full bg-background/80 text-foreground items-center justify-center text-[8px] hidden group-hover:flex"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Scheduled Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={newJob.name} onChange={(e) => setNewJob({ ...newJob, name: e.target.value })} placeholder="Job name" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={newJob.alwaysRunning}
                onCheckedChange={(c) => setNewJob({ ...newJob, alwaysRunning: !!c })}
              />
              <Label>Always Running</Label>
            </div>
            {newJob.alwaysRunning ? (
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Input value={newJob.frequency} onChange={(e) => setNewJob({ ...newJob, frequency: e.target.value })} placeholder="e.g. Every 5 min" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={newJob.time} onChange={(e) => setNewJob({ ...newJob, time: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Days</Label>
                  <div className="flex gap-2">
                    {DAY_NAMES.map((d, i) => (
                      <button
                        key={d}
                        onClick={() => toggleDay(i)}
                        className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                          newJob.days.includes(i)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {d[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {jobColors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setNewJob({ ...newJob, color: c })}
                    className={`h-6 w-6 rounded-full ${c.split(" ")[0]} ${newJob.color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addJob}>Add Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

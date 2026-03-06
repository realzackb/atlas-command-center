import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Mail,
  FileText,
  Search,
  Bot,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Tasks Completed", value: "24", icon: CheckCircle2, change: "+6 today" },
  { label: "Emails Drafted", value: "8", icon: Mail, change: "+3 today" },
  { label: "Content Pieces", value: "12", icon: FileText, change: "+2 today" },
  { label: "Research Summaries", value: "15", icon: Search, change: "+4 today" },
];

const agents = [
  {
    name: "Atlas",
    role: "Primary Orchestrator",
    status: "online",
    currentTask: "Coordinating research & content pipeline",
    lastAction: "2 min ago",
  },
  {
    name: "Personal Assistant",
    role: "Health & Wellness",
    status: "online",
    currentTask: "Researching testosterone optimization protocols",
    lastAction: "5 min ago",
  },
  {
    name: "Business Executive",
    role: "Business Operations",
    status: "online",
    currentTask: "Drafting ad scripts for Q1 campaign",
    lastAction: "1 min ago",
  },
];

const activityFeed = [
  { time: "2 min ago", agent: "Atlas", action: "Assigned research task to Personal Assistant", type: "task" },
  { time: "5 min ago", agent: "Personal Assistant", action: "Completed fitness research summary", type: "research" },
  { time: "8 min ago", agent: "Business Executive", action: "Drafted email for client onboarding", type: "email" },
  { time: "12 min ago", agent: "Atlas", action: "Created 3 new ClickUp tasks in Business workspace", type: "task" },
  { time: "15 min ago", agent: "Business Executive", action: "Generated YouTube script outline", type: "content" },
  { time: "20 min ago", agent: "Personal Assistant", action: "Updated health tracking spreadsheet", type: "research" },
];

const typeColors: Record<string, string> = {
  task: "text-primary",
  research: "text-atlas-cyan",
  email: "text-atlas-warning",
  content: "text-atlas-success",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Index() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mission Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Your AI ecosystem at a glance</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last sync: just now</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 glow-blue">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-[10px] uppercase tracking-wider text-atlas-success font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Agent Status</h2>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.name} className="glass-card p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-atlas-success" />
                      </div>
                      <span className="text-xs text-muted-foreground">{agent.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{agent.lastAction}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3 text-primary" />
                  <span>{agent.currentTask}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Activity Feed</h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="glass-card divide-y divide-border/50">
            {activityFeed.map((entry, i) => (
              <div key={i} className="p-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start gap-2">
                  <ArrowRight className={`h-3 w-3 mt-1 shrink-0 ${typeColors[entry.type]}`} />
                  <div>
                    <p className="text-xs text-foreground">
                      <span className="font-medium text-primary">{entry.agent}</span>{" "}
                      {entry.action}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

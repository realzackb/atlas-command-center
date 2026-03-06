import { motion } from "framer-motion";
import { Settings, Monitor, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function SettingsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure Atlas Mission Control</p>
      </motion.div>

      {/* System */}
      <motion.div variants={item} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Monitor className="h-4 w-4 text-primary" /> System
        </div>
        <Separator className="bg-border/50" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">OpenClaw Connection</Label>
              <p className="text-xs text-muted-foreground">Mac Mini running OpenClaw runtime</p>
            </div>
            <Badge variant="outline" className="text-atlas-success border-atlas-success/30">Connected</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Auto-sync Interval</Label>
              <p className="text-xs text-muted-foreground">How often to refresh agent data</p>
            </div>
            <Badge variant="secondary">30 seconds</Badge>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={item} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bell className="h-4 w-4 text-primary" /> Notifications
        </div>
        <Separator className="bg-border/50" />
        <div className="space-y-4">
          {[
            { label: "Task completion alerts", desc: "Notify when agents complete tasks" },
            { label: "Error notifications", desc: "Alert on agent errors or failures" },
            { label: "Daily summary", desc: "End-of-day activity summary" },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{n.label}</Label>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div variants={item} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Shield className="h-4 w-4 text-primary" /> Security & Guardrails
        </div>
        <Separator className="bg-border/50" />
        <div className="space-y-4">
          {[
            { label: "Require email approval", desc: "All emails require manual review before sending" },
            { label: "File deletion protection", desc: "Prevent agents from deleting Google Drive files" },
            { label: "ClickUp task limits", desc: "Limit agents to 20 new tasks per day" },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{n.label}</Label>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

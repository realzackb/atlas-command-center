import { motion } from "framer-motion";
import { Search, Brain, Globe, ExternalLink, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const researchItems = [
  {
    id: "1",
    title: "Testosterone Optimization: Evidence-Based Protocols",
    source: "Grok + Brave",
    agent: "Personal Assistant",
    summary: "Comprehensive analysis of natural testosterone optimization including sleep, resistance training, zinc/magnesium supplementation, and stress management protocols.",
    sources: 12,
    timestamp: "2 hours ago",
    tags: ["health", "testosterone", "fitness"],
  },
  {
    id: "2",
    title: "Q1 2025 Digital Advertising Trends",
    source: "Grok",
    agent: "Business Executive",
    summary: "Analysis of emerging trends in short-form video ads, AI-generated creative, and programmatic buying shifts for Q1 campaigns.",
    sources: 8,
    timestamp: "4 hours ago",
    tags: ["business", "advertising", "trends"],
  },
  {
    id: "3",
    title: "Sexual Wellness: Latest Clinical Research",
    source: "Brave",
    agent: "Personal Assistant",
    summary: "Review of recent clinical trials on supplements, lifestyle modifications, and evidence-based approaches to sexual wellness optimization.",
    sources: 15,
    timestamp: "Yesterday",
    tags: ["health", "wellness", "research"],
  },
  {
    id: "4",
    title: "Competitor Ad Analysis: Top Performers",
    source: "Grok + Brave",
    agent: "Business Executive",
    summary: "Breakdown of top-performing competitor ads across Meta, YouTube, and TikTok with creative strategy insights.",
    sources: 6,
    timestamp: "Yesterday",
    tags: ["business", "competitive", "ads"],
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Research() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Research Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Grok & Brave research outputs and summaries</p>
      </motion.div>

      <motion.div variants={item} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search research..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm">
          <Brain className="h-4 w-4 mr-2" /> New Research
        </Button>
      </motion.div>

      <div className="space-y-4">
        {researchItems.map((r) => (
          <motion.div key={r.id} variants={item} className="glass-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{r.summary}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {r.source.includes("Grok") && <Brain className="h-2.5 w-2.5" />}
                  {r.source.includes("Brave") && <Globe className="h-2.5 w-2.5" />}
                  {r.source}
                </Badge>
                {r.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0">
                <span className="flex items-center gap-1"><BookOpen className="h-2.5 w-2.5" />{r.sources} sources</span>
                <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{r.timestamp}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { FileText, Video, Megaphone, MessageSquare, Clock, ArrowRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentPiece {
  id: string;
  title: string;
  type: "youtube" | "short-form" | "ad-script" | "email";
  status: "ideation" | "writing" | "review" | "complete";
  agent: string;
  tools: string;
  timestamp: string;
}

const contentItems: ContentPiece[] = [
  { id: "1", title: "Why Most Entrepreneurs Fail at Scaling", type: "youtube", status: "writing", agent: "Business Executive", tools: "Grok → Claude → Google Drive", timestamp: "1 hour ago" },
  { id: "2", title: "3 Supplements That Actually Work", type: "short-form", status: "review", agent: "Business Executive", tools: "Grok → Claude", timestamp: "3 hours ago" },
  { id: "3", title: "Q1 Product Launch Ad - Version A", type: "ad-script", status: "complete", agent: "Business Executive", tools: "Claude → Google Drive", timestamp: "Yesterday" },
  { id: "4", title: "Client Welcome Email Sequence", type: "email", status: "complete", agent: "Business Executive", tools: "Claude → Google Drive", timestamp: "Yesterday" },
  { id: "5", title: "The Morning Routine That Changed Everything", type: "youtube", status: "ideation", agent: "Business Executive", tools: "Grok", timestamp: "2 hours ago" },
  { id: "6", title: "Stop Doing This at the Gym", type: "short-form", status: "writing", agent: "Business Executive", tools: "Claude", timestamp: "4 hours ago" },
];

const typeIcons: Record<string, React.ElementType> = {
  youtube: Video,
  "short-form": MessageSquare,
  "ad-script": Megaphone,
  email: FileText,
};

const statusColors: Record<string, string> = {
  ideation: "text-atlas-cyan border-atlas-cyan/30",
  writing: "text-primary border-primary/30",
  review: "text-atlas-warning border-atlas-warning/30",
  complete: "text-atlas-success border-atlas-success/30",
};

const pipelineSteps = ["Ideation (Grok)", "Writing (Claude)", "Review", "Stored (Google Drive)"];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Content() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-6xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Content Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">YouTube scripts, short-form, ad copy, and email drafts</p>
      </motion.div>

      {/* Pipeline visualization */}
      <motion.div variants={item} className="glass-card p-5 glow-blue">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Content Flow</h2>
        <div className="flex items-center justify-between">
          {pipelineSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="text-center">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mx-auto mb-1">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{step}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-primary/40" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <Tabs defaultValue="all">
        <motion.div variants={item}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="short-form">Short-Form</TabsTrigger>
            <TabsTrigger value="ad-script">Ad Scripts</TabsTrigger>
            <TabsTrigger value="email">Emails</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="all" className="mt-4">
          <div className="space-y-3">
            {contentItems.map((c) => {
              const TypeIcon = typeIcons[c.type];
              return (
                <motion.div key={c.id} variants={item} className="glass-card p-4 hover:border-primary/30 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <TypeIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{c.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{c.tools}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-[10px] ${statusColors[c.status]}`}>{c.status}</Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />{c.timestamp}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {(["youtube", "short-form", "ad-script", "email"] as const).map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            <div className="space-y-3">
              {contentItems.filter((c) => c.type === type).map((c) => {
                const TypeIcon = typeIcons[c.type];
                return (
                  <div key={c.id} className="glass-card p-4 hover:border-primary/30 transition-colors cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <TypeIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{c.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{c.tools}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-[10px] ${statusColors[c.status]}`}>{c.status}</Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />{c.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}

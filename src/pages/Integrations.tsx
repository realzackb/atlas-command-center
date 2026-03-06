import { motion } from "framer-motion";
import { Plug, ExternalLink, Shield, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Integration {
  name: string;
  description: string;
  type: "oauth" | "api_key";
  status: "connected" | "disconnected";
  account?: string;
  permissions?: string;
}

const integrations: Integration[] = [
  { name: "ClickUp (Personal)", description: "Personal task management", type: "oauth", status: "connected", account: "personal@email.com", permissions: "Full Access" },
  { name: "ClickUp (Business)", description: "Business task management", type: "oauth", status: "connected", account: "business@company.com", permissions: "Full Access" },
  { name: "Google Calendar", description: "Event scheduling & calendar sync", type: "oauth", status: "connected", account: "business@company.com", permissions: "Read & Write" },
  { name: "Google Drive (Read-Only)", description: "Document access — read only", type: "oauth", status: "connected", account: "readonly@company.com", permissions: "Read Only" },
  { name: "Google Drive (Full)", description: "Document creation & management", type: "oauth", status: "disconnected", permissions: "Full Access" },
  { name: "Grok", description: "AI research & ideation engine", type: "api_key", status: "connected" },
  { name: "Brave Search", description: "Web search & research tool", type: "api_key", status: "connected" },
  { name: "Claude", description: "AI writing & content generation", type: "api_key", status: "connected" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Integrations() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Integrations Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your OAuth connections and API keys</p>
      </motion.div>

      <motion.div variants={item} className="glass-card p-4 flex items-center gap-3 border-primary/20 glow-blue">
        <Shield className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm text-foreground font-medium">Direct OAuth Connections</p>
          <p className="text-xs text-muted-foreground">All connections use secure OAuth flows. API keys are encrypted at rest.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <motion.div key={integration.name} variants={item} className="glass-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Plug className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{integration.name}</div>
                  <div className="text-xs text-muted-foreground">{integration.description}</div>
                </div>
              </div>
              {integration.status === "connected" ? (
                <CheckCircle2 className="h-4 w-4 text-atlas-success shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-[10px]">{integration.type === "oauth" ? "OAuth 2.0" : "API Key"}</Badge>
              {integration.permissions && (
                <Badge variant="secondary" className="text-[10px]">{integration.permissions}</Badge>
              )}
            </div>

            {integration.account && (
              <p className="text-[10px] text-muted-foreground mb-3">{integration.account}</p>
            )}

            <Button
              variant={integration.status === "connected" ? "outline" : "default"}
              size="sm"
              className="w-full gap-2 text-xs"
            >
              {integration.status === "connected" ? (
                <>Manage Connection <ExternalLink className="h-3 w-3" /></>
              ) : (
                <>Connect <ExternalLink className="h-3 w-3" /></>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

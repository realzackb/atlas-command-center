import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Bot, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrgNodeCard } from "./OrgNodeCard";
import { AddAgentDialog } from "./AddAgentDialog";
import { EditAgentDialog } from "./EditAgentDialog";
import type { OrgNode } from "./types";

const defaultNodes: OrgNode[] = [
  {
    id: "atlas",
    name: "Atlas",
    role: "Primary Orchestrator",
    description: "Master agent coordinating all sub-agents via OpenClaw on Mac Mini",
    rolePrompt: "You are Atlas, the master orchestrator of a $100k/month AI-powered agency. Your job is to delegate tasks to specialized sub-agents, monitor their progress, resolve conflicts between agent outputs, and ensure all deliverables meet quality standards. You maintain the big-picture view of all client projects, timelines, and KPIs. When a new task comes in, you analyze it, break it into subtasks, assign them to the correct department head, and track completion. You never execute tasks yourself — you coordinate. You escalate only when two agents disagree or a deadline is at risk. You provide daily status summaries and weekly performance reports.",
    team: "core",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "ClickUp", "Google Drive", "Google Calendar", "Slack", "Zapier"],
    guardrails: ["No deletion of files", "Requires approval for emails", "Cannot modify billing or payments"],
    tasksCompleted: 342,
    parentId: null,
    emoji: "⚡",
  },
  // ─── MEDIA BUYING DEPARTMENT ───
  {
    id: "media-director",
    name: "Media Director",
    role: "Paid Media Department Head",
    description: "Oversees all paid advertising across Meta, Google, TikTok, and YouTube",
    rolePrompt: "You are the Media Director responsible for managing a multi-channel paid media operation spending $200k+/month across Meta Ads, Google Ads, TikTok Ads, and YouTube Ads. You review campaign performance daily, identify scaling opportunities, flag underperformers, and coordinate creative testing schedules with the Content team. You set media buying strategy including audience targeting, bid strategies, budget allocation, and platform mix. You produce weekly ROAS reports and monthly media plans. When CPA rises above target, you diagnose whether the issue is creative fatigue, audience saturation, or landing page performance and route the fix to the appropriate agent.",
    team: "media",
    status: "online",
    tools: ["Meta Ads Manager", "Google Ads", "TikTok Ads", "Triple Whale", "Hyros", "Google Sheets", "Claude"],
    guardrails: ["Cannot exceed daily budget caps without approval", "No campaign deletion", "Must document all scaling decisions"],
    tasksCompleted: 187,
    parentId: "atlas",
    emoji: "📊",
  },
  {
    id: "meta-buyer",
    name: "Meta Buyer",
    role: "Facebook & Instagram Ads Specialist",
    description: "Manages all Meta platform campaigns including prospecting, retargeting, and lookalikes",
    rolePrompt: "You are a Meta Ads specialist managing $80k+/month in ad spend across Facebook and Instagram. You build campaign structures using CBO and ABO strategies, create audience segments (lookalikes, interest stacks, broad), and manage the full funnel from TOF prospecting to BOF retargeting. You launch 3-5 new ad variations per week, kill underperformers within 48 hours based on CPA and ROAS thresholds, and scale winners by 20% increments. You write detailed creative briefs for the Content team based on winning hooks and angles. You monitor frequency, CPM trends, and auction overlap daily.",
    team: "media",
    status: "online",
    tools: ["Meta Ads Manager", "Meta Business Suite", "Triple Whale", "Google Sheets", "Claude"],
    guardrails: ["Max 20% budget increase per day", "No broad targeting without testing phase", "Must log all creative test results"],
    tasksCompleted: 156,
    parentId: "media-director",
    emoji: "📘",
  },
  {
    id: "google-buyer",
    name: "Google Buyer",
    role: "Google Ads & YouTube Ads Specialist",
    description: "Manages Search, Shopping, Performance Max, and YouTube campaigns",
    rolePrompt: "You are a Google Ads specialist managing $60k+/month across Search, Shopping, Performance Max, and YouTube. For Search, you manage keyword lists, negative keywords, match types, and ad copy testing with RSAs. For Shopping, you optimize product feeds, bidding strategies, and category segmentation. For PMax, you structure asset groups, audience signals, and monitor search term insights. For YouTube, you manage skippable in-stream and Shorts ads with frequency caps. You produce weekly search term reports, quality score audits, and ROAS breakdowns by campaign type.",
    team: "media",
    status: "online",
    tools: ["Google Ads", "Google Merchant Center", "Google Analytics", "Google Sheets", "Keyword Planner"],
    guardrails: ["No broad match without negative keyword list", "Budget changes require 24hr review period", "Must maintain Quality Score > 6"],
    tasksCompleted: 134,
    parentId: "media-director",
    emoji: "🔍",
  },
  {
    id: "tiktok-buyer",
    name: "TikTok Buyer",
    role: "TikTok & Shorts Ads Specialist",
    description: "Manages TikTok Spark Ads, In-Feed, and vertical video campaigns",
    rolePrompt: "You are a TikTok Ads specialist managing $40k+/month in spend focused on Spark Ads, In-Feed ads, and TopView placements. You understand native TikTok content patterns — UGC style, fast hooks (first 2 seconds), trending sounds, and text overlays. You structure campaigns with separate ad groups for interest targeting, lookalike audiences, and broad. You coordinate with the UGC Coordinator to source and approve creator content for Spark Ads. You test 5-10 creatives per week and make kill/scale decisions based on 3-day data windows. You track TikTok-specific metrics: hook rate, hold rate, CTR, and CVR.",
    team: "media",
    status: "online",
    tools: ["TikTok Ads Manager", "CapCut", "TikTok Creative Center", "Google Sheets", "Triple Whale"],
    guardrails: ["Minimum 3-day test window before killing", "All Spark Ads need creator approval", "No spend on unreviewed creatives"],
    tasksCompleted: 98,
    parentId: "media-director",
    emoji: "🎵",
  },
  // ─── CONTENT DEPARTMENT ───
  {
    id: "content-director",
    name: "Content Director",
    role: "Content & Creative Department Head",
    description: "Oversees all content production including scripts, emails, landing pages, and creative assets",
    rolePrompt: "You are the Content Director overseeing all creative output for the agency. You manage the content calendar, assign briefs to scriptwriters and designers, ensure brand voice consistency across all channels, and review all content before it goes live. You analyze top-performing content monthly to extract winning patterns (hooks, structures, CTAs) and update the agency's swipe file. You coordinate with the Media Director to prioritize creative production based on what's needed for ad testing. You maintain SOPs for every content type: VSLs, UGC scripts, email sequences, landing pages, blog posts, and social captions.",
    team: "content",
    status: "online",
    tools: ["Claude", "Google Docs", "Notion", "Frame.io", "Canva", "ClickUp"],
    guardrails: ["All content must pass brand voice checklist", "No publishing without review", "Must maintain content calendar 2 weeks ahead"],
    tasksCompleted: 203,
    parentId: "atlas",
    emoji: "🎬",
  },
  {
    id: "scriptwriter",
    name: "Scriptwriter",
    role: "VSL & Ad Script Specialist",
    description: "Writes video sales letters, ad scripts, and hooks for paid media campaigns",
    rolePrompt: "You are an expert direct-response scriptwriter specializing in VSLs (Video Sales Letters), ad scripts, and hooks for paid social. You write using proven frameworks: PAS (Problem-Agitate-Solution), AIDA, Star-Story-Solution, and the 'Us vs Them' angle. Every script you write has a killer hook in the first 3 seconds, an emotional story arc, clear benefit stacking, objection handling, and a strong CTA. You write 5 hook variations for every script. You study competitors' winning ads via the TikTok Creative Center and Meta Ad Library. You adapt tone for each platform — raw/authentic for TikTok, polished for YouTube, scroll-stopping for Instagram.",
    team: "content",
    status: "online",
    tools: ["Claude", "Google Docs", "Meta Ad Library", "TikTok Creative Center", "VidTao"],
    guardrails: ["All scripts need compliance review for health/income claims", "Must include 5 hook variations", "No scripts over 90 seconds without approval"],
    tasksCompleted: 178,
    parentId: "content-director",
    emoji: "✍️",
  },
  {
    id: "email-copywriter",
    name: "Email Strategist",
    role: "Email & SMS Copywriter",
    description: "Writes email sequences, broadcasts, and SMS campaigns for retention and nurture",
    rolePrompt: "You are an email and SMS marketing specialist managing retention flows and broadcast campaigns. You write welcome sequences (7-10 emails), abandoned cart flows, post-purchase nurture sequences, win-back campaigns, and weekly broadcast emails. Your writing style is conversational, story-driven, and uses curiosity-based subject lines with 40%+ open rates as the target. You segment audiences by behavior (purchasers, engagers, cold) and personalize messaging accordingly. You A/B test subject lines, send times, and CTA placement. You produce monthly retention revenue reports and maintain a 30-day email calendar.",
    team: "content",
    status: "online",
    tools: ["Klaviyo", "Claude", "Google Docs", "Google Sheets", "Attentive"],
    guardrails: ["No more than 1 email/day to any segment", "All emails must include unsubscribe", "Promotional claims require proof points"],
    tasksCompleted: 145,
    parentId: "content-director",
    emoji: "📧",
  },
  {
    id: "ugc-coordinator",
    name: "UGC Coordinator",
    role: "Creator Management & UGC Production",
    description: "Sources, briefs, and manages UGC creators for ad content",
    rolePrompt: "You are the UGC Coordinator responsible for sourcing, vetting, and managing a roster of 20+ UGC creators. You write detailed creative briefs including hook scripts, talking points, b-roll shot lists, and brand guidelines. You manage the creator pipeline from outreach to final delivery, ensuring 48-hour turnaround on edits. You maintain a database of creators organized by niche, aesthetic, price, and performance history. You negotiate rates ($150-500 per video), manage contracts, and coordinate shipping of products for demos. You QA all raw footage before passing to editors and track which creators produce the highest-converting content.",
    team: "content",
    status: "idle",
    tools: ["Insense", "Billo", "Google Sheets", "Slack", "Google Drive", "ClickUp"],
    guardrails: ["Max $500/video without approval", "All creators must sign usage rights agreement", "No publishing raw UGC without editing"],
    tasksCompleted: 67,
    parentId: "content-director",
    emoji: "🎥",
  },
  // ─── RESEARCH DEPARTMENT ───
  {
    id: "research-director",
    name: "Research Lead",
    role: "Research & Intelligence Department Head",
    description: "Conducts market research, competitor analysis, and trend monitoring",
    rolePrompt: "You are the Research Lead responsible for all market intelligence, competitor analysis, and trend monitoring for the agency. You produce weekly competitor ad breakdowns (top 5 competitors, new creatives, messaging shifts), monthly market reports (TAM updates, emerging segments, pricing trends), and quarterly strategic recommendations. You monitor Reddit, Twitter, TikTok comments, and Amazon reviews to extract customer language, objections, and desires that feed into ad copy and positioning. You maintain a living competitor database and alert the team when competitors launch new offers, change pricing, or shift messaging.",
    team: "research",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "SimilarWeb", "SpyFu", "Google Trends", "Reddit", "Google Sheets"],
    guardrails: ["No sharing competitor data externally", "Research reports must cite sources", "Trend alerts need confidence rating"],
    tasksCompleted: 112,
    parentId: "atlas",
    emoji: "🔬",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    role: "Analytics & Reporting Specialist",
    description: "Builds dashboards, tracks KPIs, and produces performance reports across all channels",
    rolePrompt: "You are the Data Analyst responsible for tracking, analyzing, and reporting on all agency KPIs. You maintain real-time dashboards showing revenue, ROAS, CPA, LTV, MER (Marketing Efficiency Ratio), and contribution margin by channel. You produce daily performance snapshots, weekly deep-dives with trend analysis, and monthly P&L-integrated reports. You run attribution analysis across Triple Whale, Hyros, and GA4 to reconcile platform-reported vs actual performance. You identify statistical significance in A/B tests, flag anomalies in spend or performance, and produce cohort analyses for LTV forecasting. You are the source of truth for all numbers.",
    team: "research",
    status: "online",
    tools: ["Google Sheets", "Looker Studio", "Triple Whale", "Google Analytics", "Hyros", "SQL", "Claude"],
    guardrails: ["Never report platform ROAS as blended ROAS", "All tests need 95% significance", "Revenue figures must reconcile with Shopify"],
    tasksCompleted: 198,
    parentId: "research-director",
    emoji: "📈",
  },
  // ─── OPERATIONS DEPARTMENT ───
  {
    id: "ops-manager",
    name: "Ops Manager",
    role: "Operations & Project Management Head",
    description: "Manages workflows, SOPs, client communications, and project timelines",
    rolePrompt: "You are the Operations Manager responsible for keeping the entire agency running smoothly. You manage all project timelines in ClickUp, ensure tasks are assigned and deadlines are met, and run weekly team standups. You maintain and update SOPs for every agency process — onboarding new clients, launching campaigns, creative production workflows, and reporting cadences. You handle client communication: weekly status updates, monthly strategy calls, and QBRs. You manage the agency's capacity planning, flagging when teams are overloaded and recommending hiring or redistribution. You own the client onboarding process from signed contract to first campaign launch (target: 7 days).",
    team: "ops",
    status: "online",
    tools: ["ClickUp", "Slack", "Google Calendar", "Google Docs", "Loom", "Zoom", "Claude"],
    guardrails: ["Client communications require review before sending", "No scope changes without contract amendment", "SOPs must be updated within 48hrs of process change"],
    tasksCompleted: 256,
    parentId: "atlas",
    emoji: "⚙️",
  },
  {
    id: "client-success",
    name: "Client Success",
    role: "Client Relations & Retention Specialist",
    description: "Manages client relationships, satisfaction, and upsell opportunities",
    rolePrompt: "You are the Client Success Manager responsible for maintaining a 95%+ client retention rate. You conduct weekly check-in calls, manage expectations proactively, and serve as the client's advocate internally. You track client health scores based on: campaign performance vs goals, communication responsiveness, NPS scores, and contract renewal dates. You identify upsell opportunities (new channels, increased spend, additional services) and coordinate with the Sales team. When a client is at risk of churning, you create a recovery plan with specific performance milestones. You own the client feedback loop — collecting, documenting, and routing feedback to the relevant teams.",
    team: "ops",
    status: "online",
    tools: ["ClickUp", "Slack", "Google Docs", "Zoom", "Google Sheets", "Claude"],
    guardrails: ["Never promise specific ROAS numbers", "Escalate churn risk within 24hrs", "All client calls must have written recap"],
    tasksCompleted: 89,
    parentId: "ops-manager",
    emoji: "🤝",
  },
  // ─── SALES DEPARTMENT ───
  {
    id: "sales-closer",
    name: "Sales Closer",
    role: "Sales & Business Development Lead",
    description: "Manages inbound leads, sales calls, and proposal creation for new clients",
    rolePrompt: "You are the Sales Lead responsible for converting inbound leads into $10k-50k/month retainer clients. You manage the full sales pipeline: lead qualification (budget >$10k/mo, product-market fit, realistic expectations), discovery calls (understanding their business, margins, current marketing), audit presentations (showing exactly where they're leaving money on the table), and proposal creation (scope, pricing, timeline, case studies). You follow up with leads on a 1-3-7-14 day cadence. You maintain a CRM with detailed notes on every interaction. Your close rate target is 30%+ on qualified leads. You produce weekly pipeline reports and monthly revenue forecasts.",
    team: "sales",
    status: "idle",
    tools: ["Claude", "Google Docs", "Google Sheets", "Calendly", "Zoom", "Slack", "Loom"],
    guardrails: ["No discounting below minimum retainer without approval", "All proposals need ops review for capacity", "Must disclose realistic timelines"],
    tasksCompleted: 73,
    parentId: "atlas",
    emoji: "💰",
  },
  // ─── PERSONAL DEPARTMENT ───
  {
    id: "personal",
    name: "Personal Assistant",
    role: "Health & Wellness Advisor",
    description: "Fitness research, testosterone coaching, sexual wellness, health tracking",
    rolePrompt: "You are a personal health and wellness AI assistant specializing in men's optimization. You research and advise on: training programs (hypertrophy, strength, mobility), nutrition protocols (macro tracking, meal timing, supplementation), testosterone optimization (sleep, stress management, micronutrients like zinc/magnesium/D3/boron), and sexual health (libido, performance, hormonal balance). You track workouts, body composition trends, and bloodwork markers over time. You create weekly meal plans, adjust training splits based on recovery data, and flag when bloodwork values fall outside optimal ranges. You keep all health data private and never share with business agents.",
    team: "personal",
    status: "online",
    tools: ["Grok", "Brave", "Claude", "ClickUp (Personal)", "Google Sheets"],
    guardrails: ["Read-only Google Drive", "Personal ClickUp only", "Never share health data with business agents", "No medical diagnoses — always recommend consulting a doctor"],
    tasksCompleted: 167,
    parentId: "atlas",
    emoji: "🏋️",
  },
  {
    id: "learning-agent",
    name: "Learning Coach",
    role: "Skill Development & Education",
    description: "Manages learning paths, course tracking, book summaries, and skill development",
    rolePrompt: "You are a Learning Coach AI responsible for accelerating personal and professional development. You maintain a reading list with prioritized book summaries and actionable takeaways. You create learning paths for new skills (e.g., 'Master Facebook Ads in 30 days' with daily tasks). You track courses in progress, extract key frameworks, and create reference sheets. You schedule learning blocks on the calendar and hold accountability by checking completion. You specialize in business education: marketing, sales psychology, copywriting, leadership, and financial literacy. You produce weekly 'insight reports' connecting what's being learned to active business challenges.",
    team: "personal",
    status: "idle",
    tools: ["Claude", "Grok", "Brave", "Google Docs", "Google Calendar", "ClickUp (Personal)"],
    guardrails: ["Learning time is protected — don't schedule over it", "Summaries must include actionable takeaways", "Max 2 courses at a time to avoid overload"],
    tasksCompleted: 45,
    parentId: "personal",
    emoji: "📚",
  },
];

const STORAGE_KEY = "atlas-org-chart-nodes";
const STORAGE_VERSION_KEY = "atlas-org-chart-version";
const CURRENT_VERSION = "2";

function loadNodes(): OrgNode[] {
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    if (version === CURRENT_VERSION) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch {}
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  return defaultNodes;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function OrgChart() {
  const [nodes, setNodes] = useState<OrgNode[]>(loadNodes);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  }, [nodes]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getChildren = useCallback(
    (parentId: string) => nodes.filter((n) => n.parentId === parentId),
    [nodes]
  );

  const root = nodes.find((n) => n.parentId === null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const draggedId = active.id as string;
    const overId = over.id as string;
    const dragged = nodes.find((n) => n.id === draggedId);

    // Don't allow root to be moved
    if (!dragged || dragged.parentId === null) return;

    // Don't allow dropping onto own descendants
    const isDescendant = (parentId: string, checkId: string): boolean => {
      const children = nodes.filter((n) => n.parentId === parentId);
      return children.some((c) => c.id === checkId || isDescendant(c.id, checkId));
    };
    if (isDescendant(draggedId, overId)) return;

    // Re-parent the dragged node under the over node
    setNodes((prev) =>
      prev.map((n) => (n.id === draggedId ? { ...n, parentId: overId } : n))
    );
  };

  const addAgent = (agent: Omit<OrgNode, "id">) => {
    setNodes((prev) => [...prev, { ...agent, id: `agent-${Date.now()}` }]);
  };

  const deleteAgent = (id: string) => {
    // Re-parent children to the deleted node's parent
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setNodes((prev) =>
      prev
        .filter((n) => n.id !== id)
        .map((n) => (n.parentId === id ? { ...n, parentId: node.parentId } : n))
    );
  };

  const updateAgent = (updated: OrgNode) => {
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setEditingNode(null);
  };

  const activeNode = activeId ? nodes.find((n) => n.id === activeId) : null;

  const renderTree = (nodeId: string, isRoot = false): React.ReactNode => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    const children = getChildren(nodeId);

    return (
      <OrgNodeCard
        key={node.id}
        node={node}
        isRoot={isRoot}
        onEdit={setEditingNode}
        onDelete={deleteAgent}
      >
        {children.length > 0
          ? children.map((child) => renderTree(child.id))
          : undefined}
      </OrgNodeCard>
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Org Chart Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag agents to restructure your AI workforce hierarchy
          </p>
        </div>
        <AddAgentDialog agents={nodes} onAdd={addAgent} />
      </motion.div>

      <motion.div variants={item} className="glass-card p-8 glow-blue overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
            <div className="flex justify-center min-w-fit">
              {root && renderTree(root.id, true)}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeNode && (
              <div className="glass-card p-4 w-60 glow-blue ring-1 ring-primary/50">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-2 text-lg">
                    {activeNode.emoji ? (
                      <span>{activeNode.emoji}</span>
                    ) : activeNode.parentId === null ? (
                      <Zap className="h-5 w-5 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-foreground">{activeNode.name}</span>
                  <span className="text-[10px] text-muted-foreground">{activeNode.role}</span>
                  <Badge variant="outline" className="mt-2 text-[10px]">{activeNode.team}</Badge>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </motion.div>

      {editingNode && (
        <EditAgentDialog
          node={editingNode}
          agents={nodes}
          onSave={updateAgent}
          onClose={() => setEditingNode(null)}
        />
      )}
    </motion.div>
  );
}

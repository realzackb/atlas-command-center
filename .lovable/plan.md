

# Atlas Mission Control — AI Agent Command Center

A sleek, dark-mode dashboard (blue & black theme inspired by Smooth Operator Solutions) to visualize, manage, and control your AI agent ecosystem.

---

## 1. Design System & Theme
- Dark mode by default — deep black backgrounds with electric blue accents
- Clean, minimal UI inspired by Smooth Operator Solutions' aesthetic
- Glassmorphism cards, subtle gradients, smooth animations
- Custom color palette: navy/black backgrounds, bright blue highlights, white text

## 2. Main Dashboard (Mission Control)
- **Activity feed** — live stream of what Atlas and sub-agents are doing (research, emails, content, tasks)
- **Status cards** — each agent shows online/offline status, current task, last action
- **Quick stats** — tasks completed today, emails drafted, content pieces created, research summaries
- **Org hierarchy visualization** — Atlas at top → Personal Assistant + Business Executive Assistant below

## 3. Agent Builder & Management
- **Create new agents** — name, role, description, assigned tools (Grok, Brave, Claude, etc.)
- **Agent configuration** — set which integrations each agent can access, define guardrails
- **"Council" management** — group agents into teams (Personal vs Business)
- **Agent detail view** — see full activity history, current assignments, tool usage

## 4. Task Management Panel
- **ClickUp integration views** — show tasks from both personal and business ClickUp accounts side by side
- **Create/assign tasks** — send new tasks to ClickUp through either account
- **Task status tracking** — kanban or list view of in-progress agent tasks
- **Filter by agent** — see which agent is handling which tasks

## 5. Integrations Hub
- **Connection manager** — connect/disconnect OAuth accounts for: ClickUp (×2), Google Calendar, Google Drive (read-only + full access), Grok, Brave, Claude
- **Connection status indicators** — green/red dots showing which services are active
- **Permission controls** — set read-only vs full access per Google Drive account
- **API key management** for non-OAuth services (Grok, Brave, Claude)

## 6. Work Streams
- **Research view** — see Grok/Brave research outputs, summaries, sources
- **Email drafts** — Claude-generated emails ready for review, stored in Google Docs
- **Content pipeline** — YouTube scripts, short-form scripts, ad copy — all flowing from ideation (Grok) → writing (Claude) → storage (Google Drive)
- **Calendar overview** — Google Calendar events relevant to agent tasks

## 7. Pages & Navigation
- Sidebar navigation with: Dashboard, Agents, Tasks, Integrations, Research, Content, Settings
- Each section gets its own detailed view
- Collapsible sidebar for maximum screen real estate

## 8. Technical Approach
- Start with the full UI and mock data to get the look and feel right
- Then progressively connect real OAuth integrations (ClickUp, Google Calendar, Google Drive) via Supabase edge functions
- AI services (Grok, Claude, Brave) will be configured through API keys stored securely
- No authentication — single-user tool


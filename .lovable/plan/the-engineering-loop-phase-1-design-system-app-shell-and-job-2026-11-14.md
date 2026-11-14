# The Engineering Loop — Phase 1: Design System, App Shell and Jobs Dashboard

## Important: your existing code
Your working app lives on GitHub, not in this project. Lovable can't link an existing GitHub repository directly. The best way to keep your real features (jobs feed, resume matching, sign-in, admin) is:
1. On GitHub, open your repo, then Code, then Download ZIP.
2. Attach the ZIP here (or use Import project on the Lovable dashboard).

Until then, Phase 1 is built so the jobs dashboard reads through one small "jobs source" layer. It can point at your existing jobs feed as soon as you share its address. No fake jobs or fake stats are shown: with no source connected, the dashboard shows a clear "connect your jobs feed" empty state.

## What gets built

### Design system
- Dark mode by default, plus a light mode and a theme switcher.
- Near-black charcoal background with slightly lighter surfaces, electric violet main color and a subtle cyan accent.
- Geist font, 8px spacing, 12px rounded corners, thin borders, soft shadows, restrained gradients.
- Shared buttons, inputs, badges, cards and skeletons, all using these settings.

### App shell
- Collapsible left sidebar with icons and tooltips: Overview, Explore Jobs, Resume Match, DSA Preparation, LLD & HLD, Engineering Resources, Market Insights, Saved Jobs, Activity & Alerts, Profile, Settings.
- Top bar: global search, Cmd/Ctrl+K command palette, notifications, theme switcher, avatar menu and breadcrumb.
- Mobile: the sidebar becomes a slide-out menu.
- Pages other than Explore Jobs get a clean "coming in a later phase" placeholder, so every link works.

### Explore Jobs dashboard
- Header: "Explore Engineering Opportunities" with live counts for active jobs, recently added, companies tracked and last refresh time.
- Large search across title, company, skills, location and keywords, with a clear button.
- Collapsible left filter panel: searchable companies with job counts, experience level, domain, location, remote/hybrid/onsite, date posted, and salary only when real salary data exists.
- Active filter chips, applied filter count and Clear all. Filters stay in the page address, so they persist between pages and can be shared.
- Mobile filter drawer.
- Job cards: logo, company, prominent title, location, work mode, level, domain, up to 5 skills with "+N more", date posted, salary if present, Save, Apply Now, and Copy LinkedIn comment.
- List view (default) and grid view; sort by newest, relevance, experience level or company; pagination.
- Loading skeletons, empty state and error state; toast messages for save and copy.
- Saved jobs and recently viewed jobs are kept on this device for now.

## Later phases (not in this plan)
Resume Match, DSA/LLD/HLD, resources, market insights, public landing page, then mobile and accessibility polish.

## Technical details
- Routes: `/jobs` is the dashboard. `/` redirects to `/jobs` until the Phase 5 landing page. Each sidebar item gets its own route file.
- `src/lib/jobs/source.ts` defines a `Job` type and a `fetchJobs(filters)` server function. It calls an external feed URL from a server secret when that is set, otherwise it returns an empty result with a "not connected" flag. Field mapping goes in one adapter.
- Filtering, sorting and pagination are done client-side with TanStack Query, and live in a pure module with unit tests (level matching, domain filter, sort order).
- Search params are validated with zod so filters survive navigation.
- Shadcn sidebar with `collapsible="icon"`, cmdk command palette, sonner toasts, next-themes-style class toggle.

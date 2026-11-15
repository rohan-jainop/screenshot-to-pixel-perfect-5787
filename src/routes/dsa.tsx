import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Accordion } from "@radix-ui/react-accordion";
import { Briefcase, FileUp, ListChecks, Map as MapIcon, MessageSquare, PlugZap, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DayCard } from "@/components/roadmap/day-card";
import { PlanSelector, ProgressCard, ScopeCard } from "@/components/roadmap/side-panel";
import { ProblemsSheet } from "@/components/roadmap/problems-sheet";
import { useImportedRoadmap, useTaskStatus } from "@/lib/roadmap/local";
import { planTasks, progressOf, searchDays } from "@/lib/roadmap/progress";
import { roadmapQueryOptions } from "@/lib/roadmap/source";
import { DIFFICULTIES, PLANS, PLAN_IDS, SHEET_SORTS, STATUSES, STATUS_LABEL, type Difficulty, type PlanId, type SheetFilters, type SheetSort, type Status } from "@/lib/roadmap/types";
import { cn } from "@/lib/utils";

interface DsaSearch {
  tab?: "sheet" | undefined;
  plan?: PlanId | undefined;
  sq?: string | undefined;
  topic?: string | undefined;
  diff?: Difficulty | undefined;
  company?: string | undefined;
  status?: Status | undefined;
  sort?: SheetSort | undefined;
  page?: number | undefined;
}
const text = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/dsa")({
  validateSearch: (s: Record<string, unknown>): DsaSearch => ({
    tab: s["tab"] === "sheet" ? "sheet" : undefined,
    plan: PLAN_IDS.includes(s["plan"] as PlanId) && s["plan"] !== "3m" ? (s["plan"] as PlanId) : undefined,
    sq: text(s["sq"]),
    topic: text(s["topic"]),
    diff: DIFFICULTIES.includes(s["diff"] as Difficulty) ? (s["diff"] as Difficulty) : undefined,
    company: text(s["company"]),
    status: STATUSES.includes(s["status"] as Status) ? (s["status"] as Status) : undefined,
    sort: SHEET_SORTS.includes(s["sort"] as SheetSort) && s["sort"] !== "default" ? (s["sort"] as SheetSort) : undefined,
    page: Number(s["page"]) > 1 ? Number(s["page"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Mentorship Roadmaps: DSA, LLD & HLD — The Engineering Loop" },
      { name: "description", content: "Structured daily roadmaps to master DSA, Low-Level Design and System Design." },
      { property: "og:title", content: "Mentorship Roadmaps: DSA, LLD & HLD — The Engineering Loop" },
      { property: "og:description", content: "Structured daily roadmaps to master DSA, Low-Level Design and System Design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const server = useQuery(roadmapQueryOptions());
  const imported = useImportedRoadmap();
  const status = useTaskStatus();
  const fileRef = useRef<HTMLInputElement>(null);

  const tab = search.tab ?? "roadmap";
  const plan = search.plan ?? "3m";
  const loading = server.isLoading || !imported.ready;
  const data = server.data?.connected ? server.data : (imported.data ?? server.data);
  const days = data?.plans[plan] ?? [];
  const problems = data?.problems ?? [];

  const [q, setQ] = useState("");
  const shown = useMemo(() => searchDays(days, q), [days, q]);
  const [open, setOpen] = useState<string[]>([]);
  useEffect(() => setOpen(days[0] ? [String(days[0].day)] : []), [plan, days]);
  useEffect(() => { if (q) setOpen(shown.map((d) => String(d.day))); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = useMemo(() => progressOf(planTasks(days), status.map), [days, status.map]);
  const available = Object.fromEntries(PLAN_IDS.map((id) => [id, data?.plans[id]?.length ?? 0])) as Record<PlanId, number>;

  const update = (patch: Partial<DsaSearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  const setStatus = (id: string, s: Status, title: string) => {
    status.set(id, s);
    toast.success(`${title} marked ${STATUS_LABEL[s]}`, { duration: 1800 });
  };

  const sheetFilters: SheetFilters = { q: search.sq, topic: search.topic, difficulty: search.diff, company: search.company, status: search.status, sort: search.sort, page: search.page };
  const onSheetFilters = (p: Partial<SheetFilters>) => {
    const patch: Partial<DsaSearch> = {};
    if ("q" in p) patch.sq = p.q;
    if ("topic" in p) patch.topic = p.topic;
    if ("difficulty" in p) patch.diff = p.difficulty;
    if ("company" in p) patch.company = p.company;
    if ("status" in p) patch.status = p.status;
    if ("sort" in p) patch.sort = p.sort;
    if ("page" in p) patch.page = p.page;
    update(patch);
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    try {
      const r = imported.importText(await file.text());
      toast.success(`Imported ${r.days} roadmap days and ${r.problems} problems`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "That file could not be read.");
    }
  };

  const notConnected = !loading && !data?.connected;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />

      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Mentorship Roadmaps</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
              <Sparkles className="size-3" /> DSA | LLD | HLD
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Master Your Engineering Interviews</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Structured daily roadmaps to master DSA, Low-Level Design and System Design.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/jobs"><Briefcase className="size-4" /> Job Board</Link>
          </Button>
          {data?.mentorUrl ? (
            <Button asChild><a href={data.mentorUrl} target="_blank" rel="noreferrer"><MessageSquare className="size-4" /> Contact Mentor</a></Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}><Button disabled><MessageSquare className="size-4" /> Contact Mentor</Button></span>
              </TooltipTrigger>
              <TooltipContent>Mentor contact link isn't set up yet</TooltipContent>
            </Tooltip>
          )}
        </div>
      </header>

      <div role="tablist" aria-label="Preparation views" className="mt-8 flex gap-6 border-b">
        <TabButton active={tab === "roadmap"} onClick={() => update({ tab: undefined })} icon={MapIcon} label="Mentorship Roadmap" badge={plan.toUpperCase()} />
        <TabButton active={tab === "sheet"} onClick={() => update({ tab: "sheet" })} icon={ListChecks} label="Top G Problems Sheet" badge={loading ? undefined : `${problems.length.toLocaleString()} problems`} />
        {data?.source === "file" && (
          <span className="ml-auto hidden items-center gap-2 self-center text-xs text-muted-foreground sm:flex">
            Imported from file
            <button className="text-primary hover:underline" onClick={() => fileRef.current?.click()}>Replace</button>
            <button className="hover:text-foreground" onClick={() => imported.clear()}>Remove</button>
          </span>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : notConnected ? (
        <EmptyState onImport={() => fileRef.current?.click()} />
      ) : data?.error ? (
        <Notice title="Couldn't load roadmaps" body={data.error} action={<Button onClick={() => server.refetch()}>Try again</Button>} />
      ) : tab === "sheet" ? (
        <div className="mt-6">
          {problems.length ? (
            <ProblemsSheet problems={problems} statuses={status.map} onStatus={setStatus} filters={sheetFilters} onFilters={onSheetFilters} />
          ) : (
            <Notice title="No problems in the sheet yet" body="The Top G problem list appears here once it's included in your roadmap data." />
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-20 lg:w-80">
            <PlanSelector value={plan} onChange={(p) => update({ plan: p === "3m" ? undefined : p })} available={available} />
            <ProgressCard {...progress} />
            <ScopeCard items={data?.scope ?? []} />
          </aside>

          <section className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{PLANS[plan].timeline}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{PLANS[plan].focus}</p>
              </div>
              {days.length > 0 && (
                <div className="flex shrink-0 gap-1 text-sm">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(shown.map((d) => String(d.day)))}>Expand all</Button>
                  <Button variant="ghost" size="sm" onClick={() => setOpen([])}>Collapse all</Button>
                </div>
              )}
            </div>

            {days.length === 0 ? (
              <Notice title={`${PLANS[plan].name} isn't available yet`} body="This schedule appears here once it's included in your roadmap data." />
            ) : (
              <>
                <div className="relative mt-4">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search days, topics or problems…" className="h-10 rounded-lg pl-10 pr-9" />
                  {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-mono text-foreground/80">{shown.length}</span> of <span className="font-mono text-foreground/80">{days.length}</span> days
                </p>
                {shown.length === 0 ? (
                  <Notice title="Nothing matches" body="Try a different topic or problem name." />
                ) : (
                  <Accordion type="multiple" value={open} onValueChange={setOpen} className="mt-3 space-y-3">
                    {shown.map((d) => <DayCard key={d.day} day={d} statuses={status.map} onStatus={setStatus} />)}
                  </Accordion>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, badge }: { active: boolean; onClick: () => void; icon: typeof MapIcon; label: string; badge?: string | undefined }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative -mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
        active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className={cn("size-4", active && "text-primary")} />
      {label}
      {badge && <span className={cn("hidden rounded-md px-1.5 py-px font-mono text-[11px] sm:inline", active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground")}>{badge}</span>}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 flex flex-col gap-6 lg:flex-row">
      <div className="space-y-4 lg:w-80">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
      <div className="flex-1 space-y-3">
        <Skeleton className="h-8 w-72" />
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    </div>
  );
}

function EmptyState({ onImport }: { onImport: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-xl border bg-card shadow-card"><PlugZap className="size-5 text-primary" /></div>
      <h3 className="mt-5 font-semibold">Connect your roadmap data</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Your 3, 6 and 9-month schedules and the Top G problem list load from your existing roadmap feed. Until it's linked, you can import a roadmap export file to use on this device.
      </p>
      <Button className="mt-5" onClick={onImport}><FileUp className="size-4" /> Import roadmap file</Button>
    </div>
  );
}

function Notice({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

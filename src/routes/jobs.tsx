import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, PlugZap, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel } from "@/components/jobs/filter-panel";
import { JobCard, JobCardSkeleton, timeAgo } from "@/components/jobs/job-card";
import { applyFilters, countActiveFilters, jobStats } from "@/lib/jobs/filter";
import { useRecentlyViewed, useSavedJobs } from "@/lib/jobs/local";
import { jobsQueryOptions } from "@/lib/jobs/source";
import { SORTS, type JobFilters, type Sort } from "@/lib/jobs/types";
import { cn } from "@/lib/utils";

const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? v.split(",") : undefined);

export const Route = createFileRoute("/jobs")({
  validateSearch: (s: Record<string, unknown>): JobFilters => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    companies: arr(s["companies"]),
    levels: arr(s["levels"]) as JobFilters["levels"],
    domains: arr(s["domains"]) as JobFilters["domains"],
    modes: arr(s["modes"]) as JobFilters["modes"],
    location: typeof s["location"] === "string" ? s["location"] : undefined,
    posted: ["24h", "7d", "30d"].includes(String(s["posted"])) ? (s["posted"] as JobFilters["posted"]) : undefined,
    sort: SORTS.includes(s["sort"] as Sort) ? (s["sort"] as Sort) : undefined,
    page: Number(s["page"]) > 1 ? Number(s["page"]) : undefined,
    view: s["view"] === "grid" ? "grid" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Engineering Jobs — The Engineering Loop" },
      { name: "description", content: "Discover engineering roles from leading technology companies." },
      { property: "og:title", content: "Explore Engineering Jobs — The Engineering Loop" },
      { property: "og:description", content: "Discover engineering roles from leading technology companies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading, isError, refetch } = useQuery(jobsQueryOptions());
  const saved = useSavedJobs();
  const recent = useRecentlyViewed();
  const [q, setQ] = useState(filters.q ?? "");
  const [panelOpen, setPanelOpen] = useState(true);

  const update = (patch: Partial<JobFilters>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  useEffect(() => {
    const t = setTimeout(() => q !== (filters.q ?? "") && update({ q: q || undefined, page: undefined }), 250);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const jobs = data?.jobs ?? [];
  const stats = useMemo(() => jobStats(jobs), [jobs]);
  const result = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);
  const active = countActiveFilters(filters);
  const view = filters.view ?? "list";
  const clearAll = () => navigate({ search: { q: filters.q, sort: filters.sort, view: filters.view } });
  const panel = <FilterPanel filters={filters} companies={stats.companies} onChange={update} />;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Explore Engineering Opportunities</h1>
        <p className="mt-2 text-muted-foreground">Discover relevant engineering roles from leading technology companies.</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Active jobs" value={isLoading ? "—" : stats.total.toLocaleString()} />
          <Stat label="Added today" value={isLoading ? "—" : String(stats.recent)} />
          <Stat label="Companies tracked" value={isLoading ? "—" : String(stats.companies.length)} />
          <Stat label="Last refresh" value={data?.refreshedAt ? timeAgo(data.refreshedAt) === "Today" ? new Date(data.refreshedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : timeAgo(data.refreshedAt) : "—"} />
        </dl>
      </header>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search job titles, companies, skills or technologies..." className="h-12 rounded-xl pl-11 pr-10 text-base" />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 lg:hidden">
                <SlidersHorizontal className="size-4" /> Filters {active > 0 && `(${active})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="px-4 pb-6">{panel}</div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" className="hidden h-12 lg:inline-flex" onClick={() => setPanelOpen((o) => !o)}>
            <SlidersHorizontal className="size-4" /> {panelOpen ? "Hide filters" : "Filters"} {active > 0 && `(${active})`}
          </Button>
          <select value={filters.sort ?? "newest"} onChange={(e) => update({ sort: e.target.value as Sort, page: undefined })} className="h-12 rounded-md border bg-background px-3 text-sm" aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="relevance">Most relevant</option>
            <option value="level">Experience level</option>
            <option value="company">Company</option>
          </select>
          <div className="hidden rounded-md border p-1 sm:flex">
            {(["list", "grid"] as const).map((v) => (
              <button key={v} onClick={() => update({ view: v === "grid" ? "grid" : undefined })} aria-label={`${v} view`} className={cn("rounded px-2.5", view === v ? "bg-secondary text-foreground" : "text-muted-foreground")}>
                {v === "list" ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {active > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {[...(filters.companies ?? []), ...(filters.levels ?? []), ...(filters.domains ?? []), ...(filters.modes ?? []), ...(filters.location ? [filters.location] : []), ...(filters.posted ? [`Past ${filters.posted}`] : [])].map((f) => (
            <span key={f} className="rounded-md border bg-accent px-2 py-0.5 text-xs text-accent-foreground">{f}</span>
          ))}
          <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">Clear all</button>
        </div>
      )}

      <div className="mt-6 flex gap-8">
        {panelOpen && <aside className="hidden w-64 shrink-0 lg:block"><div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">{panel}</div></aside>}
        <section className="min-w-0 flex-1">
          {isLoading ? (
            <div className="space-y-3">{[0, 1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}</div>
          ) : isError || data?.error ? (
            <State title="Couldn't load jobs" body={data?.error ?? "Something went wrong reaching the jobs feed."} action={<Button onClick={() => refetch()}>Try again</Button>} />
          ) : !data?.connected ? (
            <State icon title="Connect your jobs feed" body="No job source is connected yet. Once your existing jobs feed is linked, live listings appear here." />
          ) : result.total === 0 ? (
            <State title="No jobs match" body="Try a broader search or remove some filters." action={active > 0 ? <Button variant="outline" onClick={clearAll}>Clear filters</Button> : null} />
          ) : (
            <>
              <p className="mb-3 text-sm text-muted-foreground">{result.total.toLocaleString()} roles</p>
              <div className={cn("gap-3", view === "grid" ? "grid sm:grid-cols-2 2xl:grid-cols-3" : "flex flex-col")}>
                {result.items.map((job) => (
                  <JobCard key={job.id} job={job} layout={view} saved={saved.isSaved(job.id)}
                    onToggleSave={() => toast.success(saved.toggle(job.id) ? "Job saved" : "Removed from saved")}
                    onApply={() => recent.add(job.id)} />
                ))}
              </div>
              {result.pageCount > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                  <Button variant="outline" size="sm" disabled={result.page <= 1} onClick={() => update({ page: result.page - 1 > 1 ? result.page - 1 : undefined })}>Previous</Button>
                  <span className="text-muted-foreground">Page {result.page} of {result.pageCount}</span>
                  <Button variant="outline" size="sm" disabled={result.page >= result.pageCount} onClick={() => update({ page: result.page + 1 })}>Next</Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 shadow-card">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-xl font-medium">{value}</dd>
    </div>
  );
}

function State({ title, body, action, icon }: { title: string; body: string; action?: React.ReactNode; icon?: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
      {icon && <PlugZap className="mb-4 size-6 text-primary" />}
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { filterSheet, progressOf, sheetFacets, statusOf, type StatusMap } from "@/lib/roadmap/progress";
import { DIFFICULTIES, STATUSES, STATUS_LABEL, type SheetFilters, type Status, type Task } from "@/lib/roadmap/types";
import { Companies, DifficultyBadge, StatusControl, TaskLinks } from "./task-parts";

const selectCls = "h-10 min-w-0 rounded-lg border bg-background px-3 text-sm text-foreground";

export function ProblemsSheet({ problems, statuses, onStatus, filters, onFilters }: {
  problems: Task[];
  statuses: StatusMap;
  onStatus: (id: string, s: Status, title: string) => void;
  filters: SheetFilters;
  onFilters: (patch: Partial<SheetFilters>) => void;
}) {
  const [q, setQ] = useState(filters.q ?? "");
  useEffect(() => {
    const t = setTimeout(() => q !== (filters.q ?? "") && onFilters({ q: q || undefined, page: undefined }), 250);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const facets = useMemo(() => sheetFacets(problems), [problems]);
  const overall = useMemo(() => progressOf(problems, statuses), [problems, statuses]);
  const result = useMemo(() => filterSheet(problems, filters, statuses), [problems, filters, statuses]);
  const active = [filters.topic, filters.difficulty, filters.company, filters.status, filters.q].filter(Boolean).length;
  const set = (patch: Partial<SheetFilters>) => onFilters({ ...patch, page: undefined });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <MiniStat label="Problems" value={problems.length.toLocaleString()} />
        <MiniStat label="Done" value={overall.done.toLocaleString()} cls="text-success" />
        <MiniStat label="In dev" value={overall.dev.toLocaleString()} cls="text-warning" />
        <div className="rounded-xl border bg-card px-4 py-3 shadow-card">
          <div className="flex justify-between text-xs text-muted-foreground"><span>Completion</span><span className="font-mono text-foreground">{overall.percent}%</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${overall.percent}%` }} /></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search problems by name or number…" className="h-10 rounded-lg pl-10 pr-9" />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:flex">
          <select aria-label="Topic" className={selectCls} value={filters.topic ?? ""} onChange={(e) => set({ topic: e.target.value || undefined })}>
            <option value="">All topics</option>
            {facets.topics.map((t) => <option key={t.name} value={t.name}>{t.name} ({t.count})</option>)}
          </select>
          <select aria-label="Difficulty" className={selectCls} value={filters.difficulty ?? ""} onChange={(e) => set({ difficulty: (e.target.value || undefined) as SheetFilters["difficulty"] })}>
            <option value="">Any difficulty</option>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select aria-label="Company" className={selectCls} value={filters.company ?? ""} onChange={(e) => set({ company: e.target.value || undefined })}>
            <option value="">All companies</option>
            {facets.companies.map((c) => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
          </select>
          <select aria-label="Status" className={selectCls} value={filters.status ?? ""} onChange={(e) => set({ status: (e.target.value || undefined) as Status | undefined })}>
            <option value="">Any status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <select aria-label="Sort" className={cn(selectCls, "col-span-2 sm:col-span-1")} value={filters.sort ?? "default"} onChange={(e) => set({ sort: e.target.value === "default" ? undefined : (e.target.value as SheetFilters["sort"]) })}>
            <option value="default">Sheet order</option>
            <option value="frequency">Most asked</option>
            <option value="difficulty">Difficulty</option>
            <option value="title">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span><span className="font-mono text-foreground">{result.total.toLocaleString()}</span> problems</span>
        {active > 0 && (
          <button className="text-xs font-medium text-primary hover:underline" onClick={() => { setQ(""); onFilters({ q: undefined, topic: undefined, difficulty: undefined, company: undefined, status: undefined, page: undefined }); }}>
            Clear filters
          </button>
        )}
      </div>

      {result.total === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-14 text-center">
          <h3 className="font-semibold">No problems match</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a broader search or remove a filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-card">
          <div className="hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_88px_minmax(0,1.4fr)_minmax(0,1.1fr)_auto] gap-4 border-b bg-secondary/40 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground lg:grid">
            <span>Problem</span><span>Topic</span><span>Difficulty</span><span>Companies</span><span>Links</span><span className="w-[150px]">Status</span>
          </div>
          <ul className="divide-y">
            {result.items.map((p) => {
              const s = statusOf(statuses, p.id);
              return (
                <li key={p.id} className="grid gap-2 px-4 py-3 transition-colors hover:bg-secondary/30 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_88px_minmax(0,1.4fr)_minmax(0,1.1fr)_auto] lg:items-center lg:gap-4">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      {p.number != null && <span className="font-mono text-xs text-muted-foreground">#{p.number}</span>}
                      <span className={cn("font-medium", s === "done" && "text-muted-foreground line-through decoration-muted-foreground/40")}>{p.title}</span>
                      <span className="lg:hidden"><DifficultyBadge value={p.difficulty} /></span>
                    </div>
                    {p.askedBy != null && <div className="text-xs text-muted-foreground">Asked by {p.askedBy} companies</div>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{p.topics.join(", ") || "—"}</div>
                  <div className="hidden lg:block"><DifficultyBadge value={p.difficulty} /></div>
                  <div className="min-w-0"><Companies list={p.companies} max={2} /></div>
                  <div><TaskLinks task={p} /></div>
                  <StatusControl value={s} onChange={(v) => onStatus(p.id, v, p.title)} label={p.title} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {result.pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <Button variant="outline" size="sm" disabled={result.page <= 1} onClick={() => onFilters({ page: result.page - 1 > 1 ? result.page - 1 : undefined })}>Previous</Button>
          <span className="text-muted-foreground">Page {result.page} of {result.pageCount}</span>
          <Button variant="outline" size="sm" disabled={result.page >= result.pageCount} onClick={() => onFilters({ page: result.page + 1 })}>Next</Button>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 shadow-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-mono text-xl font-medium", cls)}>{value}</div>
    </div>
  );
}

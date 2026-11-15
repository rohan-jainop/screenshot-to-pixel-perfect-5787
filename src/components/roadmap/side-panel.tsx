import { CalendarDays, ChevronDown, Flame, Rocket, Trophy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PLANS, PLAN_IDS, type PlanId } from "@/lib/roadmap/types";

const PLAN_ICON = { "3m": Rocket, "6m": Flame, "9m": Trophy } as const;

export function PlanSelector({ value, onChange, available }: { value: PlanId; onChange: (p: PlanId) => void; available: Partial<Record<PlanId, number>> }) {
  const [open, setOpen] = useState(false);
  const current = PLANS[value];
  return (
    <section className="rounded-xl border bg-card p-4 shadow-card">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between lg:pointer-events-none" aria-expanded={open}>
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Choose your schedule</h2>
        <span className="flex items-center gap-1 text-sm font-medium lg:hidden">
          {current.name}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </span>
      </button>
      <div className={cn("mt-3 space-y-2", !open && "hidden lg:block")}>
        {PLAN_IDS.map((id) => {
          const plan = PLANS[id];
          const Icon = PLAN_ICON[id];
          const active = id === value;
          const loaded = available[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onChange(id);
                setOpen(false);
              }}
              aria-pressed={active}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                active ? "border-primary/50 bg-primary/10 shadow-glow" : "border-transparent bg-secondary/40 hover:border-border hover:bg-secondary",
              )}
            >
              <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-md", active ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}>
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{plan.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{plan.days}d</span>
                </span>
                <span className={cn("block text-xs", active ? "text-primary" : "text-muted-foreground")}>{plan.tagline}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{plan.focus}</span>
                {loaded === 0 && <span className="mt-1 block text-[11px] text-muted-foreground/70">Schedule not available yet</span>}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function ProgressCard({ done, dev, todo, total, percent, loading }: { done: number; dev: number; todo: number; total: number; percent: number; loading?: boolean }) {
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  return (
    <section className="rounded-xl border bg-card p-4 shadow-card">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Overall progress</h2>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-3xl font-semibold">{loading ? "—" : `${percent}%`}</div>
          <div className="text-xs text-muted-foreground">
            {loading ? "Loading…" : <><span className="font-mono text-foreground/80">{done}</span> of <span className="font-mono text-foreground/80">{total}</span> tasks completed</>}
          </div>
        </div>
        <CalendarDays className="size-5 text-muted-foreground" />
      </div>
      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Completion">
        <div className="h-full bg-success transition-all duration-500" style={{ width: `${pct(done)}%` }} />
        <div className="h-full bg-warning/80 transition-all duration-500" style={{ width: `${pct(dev)}%` }} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Todo", value: todo, cls: "text-foreground", dot: "bg-muted-foreground" },
          { label: "In dev", value: dev, cls: "text-warning", dot: "bg-warning" },
          { label: "Done", value: done, cls: "text-success", dot: "bg-success" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-background/50 px-2.5 py-2">
            <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className={cn("size-1.5 rounded-full", s.dot)} />{s.label}</dt>
            <dd className={cn("mt-0.5 font-mono text-lg font-medium", s.cls)}>{loading ? "—" : s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ScopeCard({ items }: { items: string[] }) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-card">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Mentorship scope</h2>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((s) => (
            <li key={s} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {s}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Scope details appear here once your roadmap data is connected.</p>
      )}
    </section>
  );
}

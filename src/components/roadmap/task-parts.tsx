import { Boxes, Code2, ExternalLink, FileText, Network, PlayCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { STATUSES, STATUS_LABEL, type Difficulty, type Status, type Task } from "@/lib/roadmap/types";

const STATUS_STYLE: Record<Status, string> = {
  todo: "data-[on=true]:bg-secondary data-[on=true]:text-foreground",
  dev: "data-[on=true]:bg-warning/15 data-[on=true]:text-warning",
  done: "data-[on=true]:bg-success/15 data-[on=true]:text-success",
};

export function StatusControl({ value, onChange, label }: { value: Status; onChange: (s: Status) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={`Status for ${label}`} className="inline-flex shrink-0 rounded-lg border bg-background/60 p-0.5">
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          data-on={value === s}
          onClick={() => value !== s && onChange(s)}
          className={cn(
            "h-7 min-w-11 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
            STATUS_STYLE[s],
          )}
        >
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  );
}

const DIFF_STYLE: Record<Difficulty, string> = {
  Easy: "border-success/25 bg-success/10 text-success",
  Medium: "border-warning/25 bg-warning/10 text-warning",
  Hard: "border-destructive/25 bg-destructive/10 text-destructive",
};

export function DifficultyBadge({ value }: { value?: Difficulty | undefined }) {
  if (!value) return null;
  return <span className={cn("rounded-md border px-1.5 py-px text-[11px] font-medium", DIFF_STYLE[value])}>{value}</span>;
}

export const KIND_ICON = { dsa: Code2, lld: Boxes, hld: Network } as const;
export const KIND_LABEL = { dsa: "DSA", lld: "Low-Level Design", hld: "System Design" } as const;

export function Companies({ list, max = 3 }: { list: string[]; max?: number }) {
  if (!list.length) return null;
  const shown = list.slice(0, max);
  const rest = list.length - shown.length;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {shown.map((c) => (
        <span key={c} className="rounded border bg-secondary/60 px-1.5 py-px text-[11px] text-muted-foreground">{c}</span>
      ))}
      {rest > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="rounded px-1 text-[11px] text-muted-foreground hover:text-foreground">+{rest}</button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{list.slice(max).join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </span>
  );
}

export function TaskLinks({ task, compact }: { task: Task; compact?: boolean }) {
  const links = [
    { href: task.practiceUrl, label: "Practice", icon: ExternalLink, cls: "text-primary" },
    { href: task.videoUrl, label: "Video", icon: PlayCircle, cls: "text-cyan" },
    { href: task.solutionUrl, label: "Solution", icon: FileText, cls: "text-foreground/80" },
  ].filter((l) => l.href);
  if (!links.length) return null;
  return (
    <span className="flex flex-wrap items-center gap-1">
      {links.map(({ href, label, icon: Icon, cls }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-secondary", cls)}
        >
          <Icon className="size-3.5" />
          {!compact && label}
          {compact && <span className="sr-only">{label}</span>}
        </a>
      ))}
    </span>
  );
}

export function TaskRow({ task, status, onStatus }: { task: Task; status: Status; onStatus: (s: Status) => void }) {
  const Icon = KIND_ICON[task.kind];
  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-background/40 p-3 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:p-3.5",
        status === "done" && "border-success/20 bg-success/[0.03]",
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg border bg-card", task.kind === "dsa" ? "text-primary" : "text-cyan")}>
              <Icon className="size-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{KIND_LABEL[task.kind]}</TooltipContent>
        </Tooltip>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {task.number != null && <span className="font-mono text-xs text-muted-foreground">#{task.number}</span>}
            <span className={cn("font-medium leading-snug", status === "done" && "text-muted-foreground line-through decoration-muted-foreground/40")}>{task.title}</span>
            <DifficultyBadge value={task.difficulty} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {task.askedBy != null && <span>Asked by <span className="font-mono text-foreground/80">{task.askedBy}</span> companies</span>}
            <Companies list={task.companies} />
            <TaskLinks task={task} />
          </div>
        </div>
      </div>
      <StatusControl value={status} onChange={onStatus} label={task.title} />
    </div>
  );
}

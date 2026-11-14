import { Bookmark, BookmarkCheck, Clock, Copy, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/jobs/types";

const SKILL_LIMIT = 5;

export function timeAgo(iso?: string) {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function CompanyMark({ job }: { job: Job }) {
  const [broken, setBroken] = useState(false);
  if (job.companyLogo && !broken)
    return (
      <img
        src={job.companyLogo}
        alt=""
        onError={() => setBroken(true)}
        className="size-10 shrink-0 rounded-lg border bg-background object-contain p-1"
      />
    );
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-lg border bg-secondary text-sm font-semibold text-secondary-foreground">
      {job.company.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function linkedInComment(job: Job) {
  return `Hiring alert: ${job.company} is looking for a ${job.title}${job.location ? ` (${job.location})` : ""}. Apply here: ${job.applyUrl}`;
}

export function JobCard({
  job,
  saved,
  onToggleSave,
  onApply,
  layout,
}: {
  job: Job;
  saved: boolean;
  onToggleSave: () => void;
  onApply: () => void;
  layout: "list" | "grid";
}) {
  const [expanded, setExpanded] = useState(false);
  const skills = expanded ? job.skills : job.skills.slice(0, SKILL_LIMIT);
  const hidden = job.skills.length - SKILL_LIMIT;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(linkedInComment(job));
      toast.success("LinkedIn comment copied");
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <article
      className={cn(
        "group flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40",
        layout === "list" && "md:flex-row md:items-start",
      )}
    >
      <div className="flex min-w-0 flex-1 gap-4">
        <CompanyMark job={job} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">{job.company}</span>
            {job.postedAt && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" /> {timeAgo(job.postedAt)}
                </span>
              </>
            )}
          </div>
          <h3 className="mt-1 text-[17px] font-semibold leading-snug tracking-tight">{job.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {job.location && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPin className="size-3.5 shrink-0" />
                <span className="line-clamp-1">{job.location}</span>
              </span>
            )}
            {job.workMode && <Meta>{job.workMode}</Meta>}
            {job.level && <Meta>{job.level}</Meta>}
            {job.domain && <Meta>{job.domain}</Meta>}
            {job.salary && <span className="font-medium text-cyan">{job.salary}</span>}
          </div>
          {job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {s}
                </span>
              ))}
              {hidden > 0 && (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="rounded-md px-2 py-0.5 text-xs font-medium text-primary hover:bg-accent"
                >
                  {expanded ? "Show less" : `+${hidden} more`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={cn("flex items-center gap-2", layout === "list" ? "md:flex-col md:items-end" : "mt-auto border-t pt-4")}>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onToggleSave} aria-label={saved ? "Remove from saved" : "Save job"}>
            {saved ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy LinkedIn comment">
            <Copy className="size-4" />
          </Button>
        </div>
        <Button asChild size="sm" className="ml-auto md:ml-0" disabled={!job.applyUrl}>
          <a href={job.applyUrl || undefined} target="_blank" rel="noopener noreferrer" onClick={onApply}>
            Apply now <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>
    </article>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 before:size-1 before:rounded-full before:bg-muted-foreground/40">
      {children}
    </span>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-5">
      <div className="size-10 animate-pulse rounded-lg bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-14 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

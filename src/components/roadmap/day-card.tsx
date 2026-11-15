import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { progressOf, statusOf, type StatusMap } from "@/lib/roadmap/progress";
import type { RoadmapDay, Status } from "@/lib/roadmap/types";
import { TaskRow } from "./task-parts";

export function DayCard({ day, statuses, onStatus }: { day: RoadmapDay; statuses: StatusMap; onStatus: (id: string, s: Status, title: string) => void }) {
  const p = progressOf(day.tasks, statuses);
  const complete = p.total > 0 && p.done === p.total;
  return (
    <AccordionPrimitive.Item
      value={String(day.day)}
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-card transition-colors data-[state=open]:border-primary/25",
        complete && "border-success/25",
      )}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-secondary/40 sm:px-5">
          <div className={cn("grid size-12 shrink-0 place-items-center rounded-lg border bg-background text-center", complete && "border-success/30 text-success")}>
            <div>
              <div className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">Day</div>
              <div className="font-mono text-base font-semibold leading-none">{day.day}</div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{day.title}</h3>
              {complete && <CheckCircle2 className="size-4 shrink-0 text-success" />}
            </div>
            {day.categories.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {day.categories.slice(0, 6).map((c) => (
                  <span key={c} className="rounded-md bg-secondary px-1.5 py-px text-[11px] text-muted-foreground">{c}</span>
                ))}
                {day.categories.length > 6 && <span className="text-[11px] text-muted-foreground">+{day.categories.length - 6}</span>}
              </div>
            )}
          </div>
          <div className="hidden w-32 shrink-0 sm:block">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completed</span>
              <span className={cn("font-mono", complete ? "text-success" : "text-foreground/80")}>{p.done}/{p.total}</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${p.percent}%` }} />
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground sm:hidden">{p.done}/{p.total}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="space-y-2 border-t bg-background/30 p-3 sm:p-4">
          {day.tasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No tasks listed for this day.</p>
          ) : (
            day.tasks.map((t) => <TaskRow key={t.id} task={t} status={statusOf(statuses, t.id)} onStatus={(s) => onStatus(t.id, s, t.title)} />)
          )}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

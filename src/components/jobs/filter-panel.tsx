import { Search } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DATE_RANGES, DOMAINS, LEVELS, WORK_MODES, type DateRange, type JobFilters } from "@/lib/jobs/types";

type ArrayKey = "companies" | "levels" | "domains" | "modes";

export function FilterPanel({
  filters,
  companies,
  onChange,
}: {
  filters: JobFilters;
  companies: [string, number][];
  onChange: (patch: Partial<JobFilters>) => void;
}) {
  const [companyQuery, setCompanyQuery] = useState("");
  const toggle = (key: ArrayKey, value: string) => {
    const cur = (filters[key] ?? []) as string[];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    onChange({ [key]: next.length ? next : undefined, page: undefined } as Partial<JobFilters>);
  };
  const shownCompanies = companies.filter(([c]) => c.toLowerCase().includes(companyQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <Section title="Company">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={companyQuery}
            onChange={(e) => setCompanyQuery(e.target.value)}
            placeholder="Find a company"
            className="h-8 pl-8 text-sm"
          />
        </div>
        <div className="mt-2 max-h-56 space-y-0.5 overflow-y-auto pr-1">
          {shownCompanies.length === 0 && <p className="py-2 text-xs text-muted-foreground">No companies</p>}
          {shownCompanies.map(([c, n]) => (
            <Option key={c} label={c} count={n} checked={!!filters.companies?.includes(c)} onToggle={() => toggle("companies", c)} />
          ))}
        </div>
      </Section>
      <Section title="Experience level">
        {LEVELS.map((l) => (
          <Option key={l} label={l} checked={!!filters.levels?.includes(l)} onToggle={() => toggle("levels", l)} />
        ))}
      </Section>
      <Section title="Domain">
        {DOMAINS.map((d) => (
          <Option key={d} label={d} checked={!!filters.domains?.includes(d)} onToggle={() => toggle("domains", d)} />
        ))}
      </Section>
      <Section title="Work mode">
        <div className="flex flex-wrap gap-1.5">
          {WORK_MODES.map((m) => (
            <Pill key={m} active={!!filters.modes?.includes(m)} onClick={() => toggle("modes", m)}>
              {m}
            </Pill>
          ))}
        </div>
      </Section>
      <Section title="Location">
        <Input
          defaultValue={filters.location ?? ""}
          onBlur={(e) => onChange({ location: e.target.value.trim() || undefined, page: undefined })}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          placeholder="e.g. Bengaluru"
          className="h-8 text-sm"
        />
      </Section>
      <Section title="Date posted">
        <div className="flex flex-wrap gap-1.5">
          <Pill active={!filters.posted} onClick={() => onChange({ posted: undefined, page: undefined })}>
            Any time
          </Pill>
          {(Object.keys(DATE_RANGES) as DateRange[]).map((r) => (
            <Pill key={r} active={filters.posted === r} onClick={() => onChange({ posted: r, page: undefined })}>
              {r === "24h" ? "Past 24h" : r === "7d" ? "Past week" : "Past month"}
            </Pill>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function Option({ label, count, checked, onToggle }: { label: string; count?: number; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-secondary">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && <span className="font-mono text-xs text-muted-foreground">{count}</span>}
    </label>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        active ? "border-primary/50 bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

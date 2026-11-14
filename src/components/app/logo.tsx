export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-gradient shadow-glow">
        <svg viewBox="0 0 24 24" className="size-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M8 7a5 5 0 1 0 0 10c2.5 0 4-2 4-5s1.5-5 4-5a5 5 0 1 1 0 10" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">The Engineering Loop</div>
          <div className="text-[11px] text-muted-foreground">Engineer your future</div>
        </div>
      )}
    </div>
  );
}

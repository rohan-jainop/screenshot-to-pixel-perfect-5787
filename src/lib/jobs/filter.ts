import { DATE_RANGES, LEVELS, type Job, type JobFilters } from "./types";

export const PAGE_SIZE = 20;

export function relevance(job: Job, q: string): number {
  if (!q) return 0;
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of terms) {
    if (job.title.toLowerCase().includes(t)) score += 5;
    if (job.company.toLowerCase().includes(t)) score += 3;
    if (job.skills.some((s) => s.toLowerCase().includes(t))) score += 2;
    if (job.location.toLowerCase().includes(t)) score += 1;
  }
  return score;
}

export function matchesFilters(job: Job, f: JobFilters, now = Date.now()): boolean {
  if (f.q) {
    const hay = [job.title, job.company, job.location, job.domain ?? "", job.level ?? "", ...job.skills]
      .join(" ")
      .toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t))) return false;
  }
  if (f.companies?.length && !f.companies.includes(job.company)) return false;
  if (f.levels?.length && (!job.level || !f.levels.includes(job.level))) return false;
  if (f.domains?.length && (!job.domain || !f.domains.includes(job.domain))) return false;
  if (f.modes?.length && (!job.workMode || !f.modes.includes(job.workMode))) return false;
  if (f.location && !job.location.toLowerCase().includes(f.location.toLowerCase())) return false;
  if (f.posted) {
    if (!job.postedAt) return false;
    const days = DATE_RANGES[f.posted];
    if (now - new Date(job.postedAt).getTime() > days * 86_400_000) return false;
  }
  return true;
}

export function sortJobs(jobs: Job[], f: JobFilters): Job[] {
  const out = [...jobs];
  const time = (j: Job) => (j.postedAt ? new Date(j.postedAt).getTime() : 0);
  switch (f.sort ?? "newest") {
    case "company":
      return out.sort((a, b) => a.company.localeCompare(b.company) || time(b) - time(a));
    case "level": {
      const rank = (j: Job) => (j.level ? LEVELS.indexOf(j.level) : LEVELS.length);
      return out.sort((a, b) => rank(a) - rank(b) || time(b) - time(a));
    }
    case "relevance":
      return out.sort((a, b) => relevance(b, f.q ?? "") - relevance(a, f.q ?? "") || time(b) - time(a));
    default:
      return out.sort((a, b) => time(b) - time(a));
  }
}

export function applyFilters(jobs: Job[], f: JobFilters, now = Date.now()) {
  const filtered = sortJobs(jobs.filter((j) => matchesFilters(j, f, now)), f);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, f.page ?? 1), pageCount);
  return { total: filtered.length, page, pageCount, items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}

export function countActiveFilters(f: JobFilters): number {
  return (
    (f.companies?.length ?? 0) +
    (f.levels?.length ?? 0) +
    (f.domains?.length ?? 0) +
    (f.modes?.length ?? 0) +
    (f.location ? 1 : 0) +
    (f.posted ? 1 : 0)
  );
}

export function jobStats(jobs: Job[], now = Date.now()) {
  const companies = new Map<string, number>();
  for (const j of jobs) companies.set(j.company, (companies.get(j.company) ?? 0) + 1);
  const recent = jobs.filter((j) => j.postedAt && now - new Date(j.postedAt).getTime() <= 86_400_000).length;
  return { total: jobs.length, recent, companies: [...companies.entries()].sort((a, b) => a[0].localeCompare(b[0])) };
}

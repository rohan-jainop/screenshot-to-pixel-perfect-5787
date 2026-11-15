import { DIFFICULTIES, type RoadmapDay, type SheetFilters, type Status, type Task } from "./types";

export type StatusMap = Record<string, Status>;
export const statusOf = (map: StatusMap, id: string): Status => map[id] ?? "todo";

export function progressOf(tasks: Task[], map: StatusMap) {
  const counts = { todo: 0, dev: 0, done: 0 };
  for (const t of tasks) counts[statusOf(map, t.id)]++;
  const total = tasks.length;
  return { ...counts, total, percent: total ? Math.round((counts.done / total) * 100) : 0 };
}

export const planTasks = (days: RoadmapDay[]) => days.flatMap((d) => d.tasks);

/** Keeps days (in original order) whose title, categories or tasks match the query; matching days show only matching tasks. */
export function searchDays(days: RoadmapDay[], q: string): RoadmapDay[] {
  const s = q.trim().toLowerCase();
  if (!s) return days;
  return days.flatMap((d) => {
    const dayHit = d.title.toLowerCase().includes(s) || d.categories.some((c) => c.toLowerCase().includes(s));
    const tasks = d.tasks.filter((t) => t.title.toLowerCase().includes(s) || t.topics.some((x) => x.toLowerCase().includes(s)));
    if (dayHit) return [d];
    return tasks.length ? [{ ...d, tasks }] : [];
  });
}

export const SHEET_PAGE_SIZE = 50;

export function filterSheet(problems: Task[], f: SheetFilters, map: StatusMap) {
  const q = f.q?.trim().toLowerCase();
  let rows = problems.filter(
    (p) =>
      (!q || p.title.toLowerCase().includes(q) || String(p.number ?? "") === q) &&
      (!f.topic || p.topics.includes(f.topic)) &&
      (!f.difficulty || p.difficulty === f.difficulty) &&
      (!f.company || p.companies.includes(f.company)) &&
      (!f.status || statusOf(map, p.id) === f.status),
  );
  if (f.sort === "frequency") rows = [...rows].sort((a, b) => (b.askedBy ?? -1) - (a.askedBy ?? -1));
  else if (f.sort === "difficulty") {
    const rank = (t: Task) => (t.difficulty ? DIFFICULTIES.indexOf(t.difficulty) : 99);
    rows = [...rows].sort((a, b) => rank(a) - rank(b));
  } else if (f.sort === "title") rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / SHEET_PAGE_SIZE));
  const page = Math.min(Math.max(1, f.page ?? 1), pageCount);
  return { total, page, pageCount, items: rows.slice((page - 1) * SHEET_PAGE_SIZE, page * SHEET_PAGE_SIZE) };
}

export function sheetFacets(problems: Task[]) {
  const topics = new Map<string, number>();
  const companies = new Map<string, number>();
  for (const p of problems) {
    for (const t of p.topics) topics.set(t, (topics.get(t) ?? 0) + 1);
    for (const c of p.companies) companies.set(c, (companies.get(c) ?? 0) + 1);
  }
  const sorted = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  return { topics: sorted(topics), companies: sorted(companies) };
}

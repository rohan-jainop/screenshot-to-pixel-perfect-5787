import { DIFFICULTIES, PLAN_IDS, type Difficulty, type PlanId, type RoadmapData, type RoadmapDay, type Task, type TaskKind } from "./types";

type Raw = Record<string, unknown>;
const isObj = (v: unknown): v is Raw => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const pick = (r: Raw, keys: string[]) => {
  for (const k of keys) {
    const v = str(r[k]);
    if (v) return v;
  }
  return "";
};
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};
const list = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.map((x) => (isObj(x) ? pick(x, ["name", "title", "label"]) : str(x))).filter(Boolean)
    : typeof v === "string" && v.trim()
      ? v.split(/[,|]/).map((s) => s.trim()).filter(Boolean)
      : [];
const firstList = (r: Raw, keys: string[]) => {
  for (const k of keys) {
    const l = list(r[k]);
    if (l.length) return l;
  }
  return [];
};
const firstArr = (r: Raw, keys: string[]): unknown[] => {
  for (const k of keys) if (Array.isArray(r[k])) return r[k] as unknown[];
  return [];
};

export function normalizeDifficulty(raw: string): Difficulty | undefined {
  const s = raw.toLowerCase();
  return DIFFICULTIES.find((d) => d.toLowerCase() === s);
}

function kindOf(r: Raw, title: string): TaskKind {
  const s = `${pick(r, ["kind", "type", "category", "section"])} ${title}`.toLowerCase();
  if (/\bhld\b|high[- ]level|system design/.test(s)) return "hld";
  if (/\blld\b|low[- ]level/.test(s)) return "lld";
  return "dsa";
}

/** Maps one task/problem record, keeping its original links and wording. */
export function toTask(raw: unknown, fallbackId: string): Task | null {
  if (!isObj(raw)) return null;
  let title = pick(raw, ["title", "name", "problem", "problemName", "question", "task"]);
  if (!title) return null;
  let askedBy = num(raw["askedBy"] ?? raw["asked_by"] ?? raw["companyCount"] ?? raw["company_count"] ?? raw["frequency"]);
  const asked = title.match(/\s*[-–—]\s*asked by\s+([\d,]+)\s+compan(?:y|ies)\s*$/i);
  if (asked) {
    title = title.slice(0, asked.index).trim();
    askedBy ??= num(asked[1]);
  }
  return {
    id: pick(raw, ["id", "_id", "slug", "key"]) || fallbackId,
    kind: kindOf(raw, title),
    title,
    number: num(raw["number"] ?? raw["problemNumber"] ?? raw["problem_number"] ?? raw["no"]),
    askedBy,
    difficulty: normalizeDifficulty(pick(raw, ["difficulty", "level"])),
    topics: firstList(raw, ["topics", "topic", "tags", "category", "categories"]),
    companies: firstList(raw, ["companies", "company", "companyTags", "company_tags"]),
    practiceUrl: pick(raw, ["practiceUrl", "practice_url", "practiceLink", "practice", "link", "url", "leetcode"]) || undefined,
    videoUrl: pick(raw, ["videoUrl", "video_url", "videoSolution", "video_solution", "video", "youtube"]) || undefined,
    solutionUrl: pick(raw, ["solutionUrl", "solution_url", "writtenSolution", "written_solution", "solution", "article"]) || undefined,
  };
}

function toDays(raw: unknown, plan: string): RoadmapDay[] {
  const arr = Array.isArray(raw) ? raw : isObj(raw) ? firstArr(raw, ["days", "schedule", "items", "timeline"]) : [];
  return arr.flatMap((d, i) => {
    if (!isObj(d)) return [];
    const day = num(d["day"] ?? d["dayNumber"] ?? d["day_number"]) ?? i + 1;
    const tasks = firstArr(d, ["tasks", "items", "problems", "questions"])
      .map((t, j) => toTask(t, `${plan}-d${day}-${j}`))
      .filter((t): t is Task => !!t);
    const categories = firstList(d, ["categories", "topics", "tags"]);
    return [{
      day,
      title: pick(d, ["title", "name", "topic", "heading"]) || `Day ${day}`,
      categories: categories.length ? categories : [...new Set(tasks.flatMap((t) => t.topics))],
      tasks,
    }];
  });
}

function planIdOf(key: string): PlanId | undefined {
  const k = key.toLowerCase().replace(/three/g, "3").replace(/six/g, "6").replace(/nine/g, "9");
  const m = k.match(/(?:^|\D)([369])(?:\D|$)/);
  return m ? PLAN_IDS.find((p) => p.startsWith(m[1]!)) : undefined;
}

/** Accepts the roadmap export in several common shapes; unknown shapes yield empty data, never invented content. */
export function toRoadmapData(body: unknown): Omit<RoadmapData, "connected" | "source"> {
  const root = isObj(body) ? body : {};
  const plans: RoadmapData["plans"] = {};
  const plansRaw = root["plans"] ?? root["roadmaps"] ?? root["schedules"];
  if (Array.isArray(plansRaw)) {
    for (const p of plansRaw) {
      if (!isObj(p)) continue;
      const id = planIdOf(pick(p, ["id", "key", "name", "duration", "months"]));
      if (id) plans[id] = toDays(p, id);
    }
  } else if (isObj(plansRaw)) {
    for (const [k, v] of Object.entries(plansRaw)) {
      const id = planIdOf(k);
      if (id) plans[id] = toDays(v, id);
    }
  }
  const problems = firstArr(root, ["problems", "sheet", "topG", "top_g", "questions"])
    .map((p, i) => toTask(p, `sheet-${i}`))
    .filter((t): t is Task => !!t);
  return {
    plans,
    problems,
    scope: firstList(root, ["scope", "mentorshipScope", "mentorship_scope"]),
    mentorUrl: pick(root, ["mentorUrl", "mentor_url", "contactUrl", "contact_url"]) || undefined,
  };
}

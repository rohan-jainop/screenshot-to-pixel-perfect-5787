import { DOMAINS, LEVELS, WORK_MODES, type Domain, type Job, type Level, type WorkMode } from "./types";

type Raw = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const pick = (r: Raw, keys: string[]) => {
  for (const k of keys) {
    const v = str(r[k]);
    if (v) return v;
  }
  return "";
};

export function normalizeLevel(raw: string): Level | undefined {
  const s = raw.toLowerCase();
  if (!s) return undefined;
  const exact = LEVELS.find((l) => l.toLowerCase() === s);
  if (exact) return exact;
  if (/intern|graduate|new grad|campus/.test(s)) return "Intern / Graduate";
  if (/manager|principal|director|12-15/.test(s)) return "Manager / Principal";
  if (/staff|lead|8-12/.test(s)) return "Staff / Lead";
  if (/senior|sde-?3|sde ?iii|5-8/.test(s)) return "Senior / SDE-3";
  if (/sde-?2|sde ?ii|2-4|mid/.test(s)) return "SDE-2";
  if (/sde-?1|sde ?i\b|0-1|junior|entry/.test(s)) return "SDE-1";
  return undefined;
}

export function normalizeDomain(raw: string): Domain | undefined {
  const s = raw.toLowerCase();
  if (!s) return undefined;
  const exact = DOMAINS.find((d) => d.toLowerCase() === s);
  if (exact) return exact;
  if (/full ?stack/.test(s)) return "Fullstack";
  if (/front/.test(s)) return "Frontend";
  if (/back/.test(s)) return "Backend";
  if (/devops|sre|cloud/.test(s)) return "DevOps / SRE / Cloud";
  if (/data|ml|ai|machine/.test(s)) return "Data / AI / ML";
  if (/mobile|android|ios/.test(s)) return "Mobile";
  if (/security|qa|infra|test/.test(s)) return "Security / QA / Infra";
  if (/manage|lead/.test(s)) return "Management / Lead";
  return undefined;
}

export function normalizeMode(raw: string, location = ""): WorkMode | undefined {
  const s = `${raw} ${location}`.toLowerCase();
  if (/hybrid/.test(s)) return "Hybrid";
  if (/remote/.test(s)) return "Remote";
  const exact = WORK_MODES.find((m) => m.toLowerCase() === raw.toLowerCase());
  return exact ?? (raw ? "Onsite" : undefined);
}

/** Maps one record from the existing jobs feed into the app's Job shape. */
export function toJob(r: Raw, index: number): Job | null {
  const title = pick(r, ["title", "job_title", "role", "position"]);
  const company = pick(r, ["company", "company_name", "employer"]);
  const applyUrl = pick(r, ["apply_url", "applyUrl", "url", "link", "job_url"]);
  if (!title || !company) return null;
  const location = pick(r, ["location", "locations", "city"]);
  const rawSkills = r["skills"] ?? r["tags"] ?? r["technologies"];
  const skills = Array.isArray(rawSkills)
    ? rawSkills.map(str).filter(Boolean)
    : str(rawSkills).split(/[,|]/).map((s) => s.trim()).filter(Boolean);
  const posted = pick(r, ["posted_at", "postedAt", "date_posted", "created_at", "date"]);
  const postedDate = posted ? new Date(posted) : undefined;
  return {
    id: pick(r, ["id", "job_id", "_id"]) || `${company}-${title}-${index}`,
    title,
    company,
    companyLogo: pick(r, ["company_logo", "logo", "logo_url"]) || undefined,
    location,
    workMode: normalizeMode(pick(r, ["work_mode", "remote", "workplace_type"]), location),
    level: normalizeLevel(pick(r, ["level", "experience_level", "seniority", "experience"])),
    domain: normalizeDomain(pick(r, ["domain", "category", "team"])),
    skills,
    postedAt: postedDate && !isNaN(postedDate.getTime()) ? postedDate.toISOString() : undefined,
    salary: pick(r, ["salary", "compensation", "pay"]) || undefined,
    applyUrl,
  };
}

export function toJobs(payload: unknown): Job[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? ((payload as Raw)["jobs"] ?? (payload as Raw)["data"] ?? (payload as Raw)["results"])
      : [];
  if (!Array.isArray(list)) return [];
  return list.flatMap((r, i) => (r && typeof r === "object" ? (toJob(r as Raw, i) ?? []) : []));
}

import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { toJobs } from "./adapter";
import type { JobsResult } from "./types";

/** Reads jobs from the existing jobs feed (JOBS_FEED_URL). No feed configured = not connected, no fake data. */
export const fetchJobs = createServerFn({ method: "GET" }).handler(async (): Promise<JobsResult> => {
  const url = process.env["JOBS_FEED_URL"];
  if (!url) return { connected: false, jobs: [] };
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env["JOBS_FEED_TOKEN"]) headers["Authorization"] = `Bearer ${process.env["JOBS_FEED_TOKEN"]}`;
    const res = await fetch(url, { headers });
    if (!res.ok) return { connected: true, jobs: [], error: `Jobs feed responded ${res.status}` };
    const body = await res.json();
    const refreshed =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body.last_scraped ?? body.lastScraped ?? body.refreshed_at)
        : undefined;
    return { connected: true, jobs: toJobs(body), refreshedAt: refreshed ?? new Date().toISOString() };
  } catch (e) {
    return { connected: true, jobs: [], error: e instanceof Error ? e.message : "Could not reach the jobs feed" };
  }
});

export const jobsQueryOptions = () =>
  queryOptions({ queryKey: ["jobs"], queryFn: () => fetchJobs(), staleTime: 5 * 60_000 });

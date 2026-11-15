import { describe, expect, it } from "vitest";
import { toRoadmapData, toTask } from "./adapter";
import { filterSheet, progressOf, searchDays } from "./progress";
import type { Task } from "./types";

const t = (id: string, extra: Partial<Task> = {}): Task => ({ id, kind: "dsa", title: id, topics: [], companies: [], ...extra });

describe("roadmap progress", () => {
  it("counts todo, dev and done from task statuses", () => {
    const p = progressOf([t("a"), t("b"), t("c"), t("d")], { a: "done", b: "dev" });
    expect(p).toEqual({ todo: 2, dev: 1, done: 1, total: 4, percent: 25 });
  });

  it("reports 0% when there are no tasks", () => {
    expect(progressOf([], {}).percent).toBe(0);
  });

  it("keeps day order when searching tasks", () => {
    const days = [
      { day: 1, title: "Two Sum & LRU Cache", categories: [], tasks: [t("Two Sum"), t("LRU Cache")] },
      { day: 2, title: "Graphs", categories: [], tasks: [t("Two Sum II")] },
    ];
    const r = searchDays(days, "two sum");
    expect(r.map((d) => d.day)).toEqual([1, 2]);
    expect(r[1]!.tasks.map((x) => x.id)).toEqual(["Two Sum II"]);
  });

  it("filters the sheet by status and sorts by company frequency", () => {
    const rows = [t("a", { askedBy: 10 }), t("b", { askedBy: 116 }), t("c", { askedBy: 50 })];
    expect(filterSheet(rows, { sort: "frequency" }, {}).items.map((x) => x.id)).toEqual(["b", "c", "a"]);
    expect(filterSheet(rows, { status: "done" }, { c: "done" }).items.map((x) => x.id)).toEqual(["c"]);
  });
});

describe("roadmap adapter", () => {
  it("splits 'Asked by N companies' out of a title", () => {
    const task = toTask({ title: "Two Sum - Asked by 116 companies", difficulty: "EASY" }, "x");
    expect(task).toMatchObject({ title: "Two Sum", askedBy: 116, difficulty: "Easy" });
  });

  it("maps 3/6/9 month plans by key and keeps task order", () => {
    const data = toRoadmapData({ plans: { "3-month": [{ day: 1, title: "D1", tasks: [{ title: "A" }, { title: "B" }] }], nine_month: [] } });
    expect(data.plans["3m"]![0]!.tasks.map((x) => x.title)).toEqual(["A", "B"]);
    expect(data.plans["9m"]).toEqual([]);
    expect(data.plans["6m"]).toBeUndefined();
  });
});

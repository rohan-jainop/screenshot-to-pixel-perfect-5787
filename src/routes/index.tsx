import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/jobs" });
  },
  head: () => ({
    meta: [
      { title: "The Engineering Loop — Engineering jobs and career growth" },
      { name: "description", content: "Discover engineering roles at leading tech companies and grow your career." },
      { property: "og:title", content: "The Engineering Loop" },
      { property: "og:description", content: "Discover engineering roles at leading tech companies and grow your career." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

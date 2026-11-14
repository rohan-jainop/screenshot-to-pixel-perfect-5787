import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Market Insights — The Engineering Loop" },
      { name: "description", content: "Hiring trends across top tech companies." },
      { property: "og:title", content: "Market Insights — The Engineering Loop" },
      { property: "og:description", content: "Hiring trends across top tech companies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Market Insights" description="Hiring trends across top tech companies." icon={BarChart3} />,
});

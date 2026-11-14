import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Overview — The Engineering Loop" },
      { name: "description", content: "Your career at a glance." },
      { property: "og:title", content: "Overview — The Engineering Loop" },
      { property: "og:description", content: "Your career at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Overview" description="Your career at a glance." icon={LayoutDashboard} />,
});

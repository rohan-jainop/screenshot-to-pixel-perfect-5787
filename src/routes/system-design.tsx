import { createFileRoute } from "@tanstack/react-router";
import { Network } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/system-design")({
  head: () => ({
    meta: [
      { title: "LLD & HLD — The Engineering Loop" },
      { name: "description", content: "Low-level and high-level system design." },
      { property: "og:title", content: "LLD & HLD — The Engineering Loop" },
      { property: "og:description", content: "Low-level and high-level system design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="LLD & HLD" description="Low-level and high-level system design." icon={Network} />,
});

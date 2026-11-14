import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — The Engineering Loop" },
      { name: "description", content: "Account and app preferences." },
      { property: "og:title", content: "Settings — The Engineering Loop" },
      { property: "og:description", content: "Account and app preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Settings" description="Account and app preferences." icon={Settings} />,
});

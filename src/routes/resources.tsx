import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Engineering Resources — The Engineering Loop" },
      { name: "description", content: "Curated resources to level up." },
      { property: "og:title", content: "Engineering Resources — The Engineering Loop" },
      { property: "og:description", content: "Curated resources to level up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Engineering Resources" description="Curated resources to level up." icon={BookOpen} />,
});

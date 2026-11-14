import { createFileRoute } from "@tanstack/react-router";
import { Code2 } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/dsa")({
  head: () => ({
    meta: [
      { title: "DSA Preparation — The Engineering Loop" },
      { name: "description", content: "Master data structures and algorithms." },
      { property: "og:title", content: "DSA Preparation — The Engineering Loop" },
      { property: "og:description", content: "Master data structures and algorithms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="DSA Preparation" description="Master data structures and algorithms." icon={Code2} />,
});

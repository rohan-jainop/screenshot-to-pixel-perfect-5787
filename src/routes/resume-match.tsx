import { createFileRoute } from "@tanstack/react-router";
import { FileSearch } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/resume-match")({
  head: () => ({
    meta: [
      { title: "Resume Match — The Engineering Loop" },
      { name: "description", content: "Find jobs that match your profile." },
      { property: "og:title", content: "Resume Match — The Engineering Loop" },
      { property: "og:description", content: "Find jobs that match your profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Resume Match" description="Find jobs that match your profile." icon={FileSearch} />,
});

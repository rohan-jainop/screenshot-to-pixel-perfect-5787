import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Jobs — The Engineering Loop" },
      { name: "description", content: "Jobs you've bookmarked." },
      { property: "og:title", content: "Saved Jobs — The Engineering Loop" },
      { property: "og:description", content: "Jobs you've bookmarked." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Saved Jobs" description="Jobs you've bookmarked." icon={Bookmark} />,
});

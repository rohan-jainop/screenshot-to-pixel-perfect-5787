import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity & Alerts — The Engineering Loop" },
      { name: "description", content: "Job alerts and recent activity." },
      { property: "og:title", content: "Activity & Alerts — The Engineering Loop" },
      { property: "og:description", content: "Job alerts and recent activity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Activity & Alerts" description="Job alerts and recent activity." icon={Activity} />,
});

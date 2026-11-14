import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { PlaceholderPage } from "@/components/app/placeholder";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — The Engineering Loop" },
      { name: "description", content: "Your engineering profile." },
      { property: "og:title", content: "Profile — The Engineering Loop" },
      { property: "og:description", content: "Your engineering profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Profile" description="Your engineering profile." icon={User} />,
});

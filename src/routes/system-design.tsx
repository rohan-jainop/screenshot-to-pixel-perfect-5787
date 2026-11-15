import { createFileRoute, redirect } from "@tanstack/react-router";

// LLD & HLD live inside the Mentorship Roadmaps page alongside DSA.
export const Route = createFileRoute("/system-design")({
  beforeLoad: () => {
    throw redirect({ to: "/dsa", replace: true });
  },
});

import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <div className="grid size-12 place-items-center rounded-xl border bg-card shadow-card">
        <Icon className="size-5 text-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <p className="mt-1 text-sm text-muted-foreground">This area gets its redesign in a later phase.</p>
      <Button asChild className="mt-6">
        <Link to="/jobs">Explore jobs</Link>
      </Button>
    </div>
  );
}

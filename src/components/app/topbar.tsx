import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommandPalette } from "./command-palette";
import { ALL_NAV } from "./nav";
import { ThemeToggle } from "./theme";

export function Topbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const current = ALL_NAV.find((n) => path.startsWith(n.url));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-xl md:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm sm:flex">
        <span className="text-muted-foreground">Workspace</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-medium">{current?.title ?? "Home"}</span>
      </nav>
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 items-center gap-2 rounded-lg border bg-secondary/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:w-72"
        >
          <Search className="size-4" />
          <span className="hidden md:inline">Search or jump to…</span>
          <kbd className="ml-auto hidden rounded border bg-background px-1.5 font-mono text-[10px] md:inline">⌘K</kbd>
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 text-sm">
            <div className="font-medium">Notifications</div>
            <p className="mt-1 text-muted-foreground">You're all caught up.</p>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8">
              <AvatarFallback className="bg-accent text-xs text-accent-foreground">You</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate({ to: "/profile" })}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate({ to: "/saved" })}>Saved jobs</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </header>
  );
}

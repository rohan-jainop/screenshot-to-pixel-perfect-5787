import { useNavigate } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ALL_NAV } from "./nav";
import { useTheme } from "./theme";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const { toggle } = useTheme();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (url: string) => {
    onOpenChange(false);
    navigate({ to: url });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to a page or search jobs…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {ALL_NAV.map((n) => (
            <CommandItem key={n.url} onSelect={() => go(n.url)}>
              <n.icon className="size-4" /> {n.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              toggle();
              onOpenChange(false);
            }}
          >
            <Moon className="size-4" /> Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

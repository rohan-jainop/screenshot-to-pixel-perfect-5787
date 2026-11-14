import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const themeScript = `try{if(localStorage.getItem('tel:theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`;

export function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tel:theme", next ? "dark" : "light");
    setDark(next);
  };
  return { dark, toggle };
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

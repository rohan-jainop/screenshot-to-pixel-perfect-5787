import {
  Activity,
  BarChart3,
  Bookmark,
  BookOpen,
  Briefcase,
  Code2,
  FileSearch,
  LayoutDashboard,
  Network,
  Settings,
  User,
} from "lucide-react";

export const NAV_MAIN = [
  { title: "Overview", url: "/overview", icon: LayoutDashboard },
  { title: "Explore Jobs", url: "/jobs", icon: Briefcase },
  { title: "Resume Match", url: "/resume-match", icon: FileSearch },
] as const;

export const NAV_LEARN = [
  { title: "DSA Preparation", url: "/dsa", icon: Code2 },
  { title: "LLD & HLD", url: "/system-design", icon: Network },
  { title: "Engineering Resources", url: "/resources", icon: BookOpen },
  { title: "Market Insights", url: "/insights", icon: BarChart3 },
] as const;

export const NAV_YOU = [
  { title: "Saved Jobs", url: "/saved", icon: Bookmark },
  { title: "Activity & Alerts", url: "/activity", icon: Activity },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export const ALL_NAV = [...NAV_MAIN, ...NAV_LEARN, ...NAV_YOU];

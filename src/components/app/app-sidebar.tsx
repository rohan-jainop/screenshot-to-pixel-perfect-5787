import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { NAV_LEARN, NAV_MAIN, NAV_YOU } from "./nav";

const GROUPS = [
  { label: "Discover", items: NAV_MAIN },
  { label: "Learn", items: NAV_LEARN },
  { label: "You", items: NAV_YOU },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/jobs" aria-label="The Engineering Loop home">
          <Logo compact={state === "collapsed"} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {GROUPS.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={path.startsWith(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

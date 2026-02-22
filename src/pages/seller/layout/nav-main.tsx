import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavGroup } from "@/types";
import { cn } from "@/lib/utils";

interface NavMainProps {
  groups: NavGroup[];
}

export function NavMain({ groups }: NavMainProps) {
  const { pathname } = useLocation();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = item.href && pathname === item.href;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className={cn(
                      "hover:bg-doju-lime-pale hover:text-doju-lime h-10 font-inter transition-colors",
                      isActive && "bg-doju-lime-pale text-doju-lime",
                    )}
                  >
                    <Link to={item.href!}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

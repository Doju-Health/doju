"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "../layout/nav-main";
import { sidebarNav } from "@/config/sidebar-nav";
import DojuLogo from "@/assets/doju-logo.png";
import { LogOutModal } from "../components/modal/logout-modal";
import { LogOut } from "lucide-react";
// TODO: Replace with real user data from auth context

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className="h-full! relative!">
      <SidebarHeader className="border-b py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <img src={DojuLogo} alt="Doju Logo" className="w-28 h-10 mx-auto object-cover" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={sidebarNav} />
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter className="border-t py-5">
        <LogOutModal setOpenSidebar={setOpenMobile}>
          <div
            className="flex cursor-pointer h-10 font-reddit items-center gap-2 px-4 py-5 
          text-red-500 dark:text-gray-200 
          hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <LogOut className="size-4" />
            <span className="text-sm">Log Out</span>
          </div>
        </LogOutModal>
      </SidebarFooter>
    </Sidebar>
  );
}

// import { SidebarInset } from "@/components/ui/sidebar";
import { AdminAppSidebar } from "./admin-app-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AdminAppLayout = () => {
  return (
    <div className="flex overflow-hidden h-screen w-screen min-w-[320px]">
      <AdminAppSidebar />
      {/* <SidebarInset > */}
      <main className="overflow-y-auto overflow-x-hidden flex-1 p-5">
        <SidebarTrigger className="md:hidden mb-4" />
        <Outlet />
      </main>
      {/* </SidebarInset> */}
    </div>
  );
};

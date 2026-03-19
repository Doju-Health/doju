// import { SidebarInset } from "@/components/ui/sidebar";
import { AdminAppSidebar } from "./admin-app-sidebar";
import { Outlet } from "react-router-dom";

export const AdminAppLayout = () => {
  return (
    <div className="flex overflow-hidden h-screen w-screen min-w-[320px]">
      <AdminAppSidebar />
      {/* <SidebarInset > */}
      <main className="overflow-y-auto overflow-x-hidden flex-1 p-5">
        <Outlet />
      </main>
      {/* </SidebarInset> */}
    </div>
  );
};

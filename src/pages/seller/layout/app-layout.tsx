// import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const SellerAppLayout = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authData.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
    } else if (user.role !== "seller") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "seller") {
    return null;
  }

  return (
    <div>
      <div className="flex overflow-hidden h-screen w-screen min-w-[320px]">
        <AppSidebar />
        {/* <SidebarInset > */}
        <main className="overflow-y-auto overflow-x-hidden flex-1 p-5">
          <SidebarTrigger className="md:hidden mb-4" />
          <Outlet />
        </main>
        {/* </SidebarInset> */}
      </div>
    </div>
  );
};

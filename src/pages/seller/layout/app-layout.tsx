// import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";
import { useEffect } from "react";

export const SellerAppLayout = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetUserProfile();

  useEffect(() => {
    if (!isLoading && profile && profile.role !== "seller") {
      navigate("/", { replace: true });
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  if (profile?.role !== "seller") {
    return null;
  }

  return (
    <div className="flex overflow-hidden h-screen w-screen min-w-[320px]">
      <AppSidebar />
      {/* <SidebarInset > */}
      <main className="overflow-y-auto overflow-x-hidden flex-1 p-5">
        <Outlet />
      </main>
      {/* </SidebarInset> */}
    </div>
  );
};

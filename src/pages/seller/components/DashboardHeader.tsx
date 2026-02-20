import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  sellerName?: string;
}

export const DashboardHeader = ({
  sellerName = "John Seller",
}: DashboardHeaderProps) => {
  return (
    <div className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-4 gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

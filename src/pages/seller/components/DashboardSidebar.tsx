import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  ShoppingCart,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import dojuLogo from "@/assets/doju-logo.jpg";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { icon: BarChart3, label: "Overview", value: "overview" },
  { icon: Package, label: "Products", value: "products" },
  { icon: ShoppingCart, label: "Orders", value: "orders" },
  { icon: MessageCircle, label: "Messages", value: "messages" },
  { icon: Settings, label: "Settings", value: "settings" },
];

export const DashboardSidebar = ({
  activeTab,
  onTabChange,
}: DashboardSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2">
          <img
            src={dojuLogo}
            alt="Doju"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-bold text-lg">DOJU Seller</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-3">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.value}>
                <SidebarMenuButton
                  onClick={() => onTabChange(item.value)}
                  isActive={activeTab === item.value}
                  className=""
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

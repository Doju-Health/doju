import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { OverviewTab } from "./components/OverviewTab";
import { OrdersTab } from "./components/OrdersTab";
import { ProductsTab } from "./components/ProductsTab";
import { MessagesTab } from "./components/MessagesTab";
import { SettingsTab } from "./components/SettingsTab";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleViewAllOrders = () => {
    setActiveTab("orders");
  };

  const handleViewAllProducts = () => {
    setActiveTab("products");
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleEditProduct = (productId: string) => {
    console.log("Edit product:", productId);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId);
  };

  const handleUpdateOrderStatus = (orderId: string, currentStatus: string) => {
    console.log("Update order status:", orderId, currentStatus);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* <DashboardHeader /> */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 lg:p-6 space-y-6">
              {activeTab === "overview" && (
                <OverviewTab
                  onViewAllOrders={handleViewAllOrders}
                  onViewAllProducts={handleViewAllProducts}
                  onAddProduct={handleAddProduct}
                />
              )}

              {activeTab === "products" && (
                <ProductsTab
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === "orders" && (
                <OrdersTab onUpdateStatus={handleUpdateOrderStatus} />
              )}

              {activeTab === "messages" && <MessagesTab />}

              {activeTab === "settings" && <SettingsTab />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SellerDashboard;

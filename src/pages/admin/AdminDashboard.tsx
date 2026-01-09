import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Users, Package, ShoppingCart, DollarSign, 
  TrendingUp, Search, MoreVertical,
  CheckCircle, XCircle, Clock, UserCheck,
  BarChart3, Activity, Shield, Check, X, Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock data for admin dashboard
const mockStats = {
  totalSales: 15420000,
  totalOrders: 342,
  totalUsers: 1250,
  totalProducts: 156,
  activeSellers: 24,
  pendingApprovals: 3,
};

const mockOrders = [
  { id: 'ORD-001', customer: 'Dr. Adaeze Nwankwo', amount: 85000, status: 'completed', date: '2024-01-08' },
  { id: 'ORD-002', customer: 'Lagos General Hospital', amount: 450000, status: 'processing', date: '2024-01-08' },
  { id: 'ORD-003', customer: 'PharmaCare Ltd', amount: 125000, status: 'pending', date: '2024-01-07' },
  { id: 'ORD-004', customer: 'Dr. Chukwuma Obi', amount: 52000, status: 'completed', date: '2024-01-07' },
  { id: 'ORD-005', customer: 'Abuja Medical Center', amount: 280000, status: 'shipped', date: '2024-01-06' },
];

const mockUsers = [
  { id: '1', name: 'Dr. Adaeze Nwankwo', email: 'adaeze@email.com', role: 'buyer', status: 'active', joinDate: '2024-01-01' },
  { id: '2', name: 'MedSupply Nigeria', email: 'contact@medsupply.ng', role: 'seller', status: 'active', joinDate: '2023-12-15' },
  { id: '3', name: 'PharmaCare Ltd', email: 'info@pharmacare.ng', role: 'seller', status: 'pending', joinDate: '2024-01-05' },
  { id: '4', name: 'Dr. Chukwuma Obi', email: 'chukwuma@email.com', role: 'buyer', status: 'active', joinDate: '2023-11-20' },
];

const initialMockProducts = [
  { id: '1', name: 'Classic Stethoscope III', seller: 'OmniCare', price: 85000, status: 'approved', views: 1250, description: 'Premium stethoscope for medical professionals' },
  { id: '2', name: 'Automatic BP Monitor', seller: 'PulseCheck', price: 52000, status: 'approved', views: 890, description: 'Digital blood pressure monitor with LCD display' },
  { id: '3', name: 'Portable O2 Concentrator', seller: 'AeroMed', price: 459000, status: 'pending', views: 45, description: 'Lightweight portable oxygen concentrator with 5L flow rate' },
  { id: '4', name: 'Infrared Thermometer', seller: 'ThermaCo', price: 25500, status: 'approved', views: 2100, description: 'Non-contact infrared thermometer with instant readings' },
  { id: '5', name: 'Advanced ECG Monitor', seller: 'CardioTech', price: 180000, status: 'pending', views: 12, description: '12-lead ECG monitor with Bluetooth connectivity' },
  { id: '6', name: 'Surgical Mask Box (50pcs)', seller: 'MedSupply', price: 8500, status: 'pending', views: 8, description: '3-ply surgical masks, medical grade' },
];

const topProducts = [
  { name: 'Infrared Thermometer', sales: 203, revenue: 5176500 },
  { name: 'Finger Pulse Oximeter', sales: 156, revenue: 2964000 },
  { name: 'Classic Stethoscope III', sales: 127, revenue: 10795000 },
  { name: 'Automatic BP Monitor', sales: 89, revenue: 4628000 },
];

interface ProductType {
  id: string;
  name: string;
  seller: string;
  price: number;
  status: string;
  views: number;
  description: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ProductType[]>(initialMockProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth?admin=true');
    }
  }, [user, isAdmin, loading, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      completed: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      approved: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      active: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      processing: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <Clock className="h-3 w-3" /> },
      shipped: { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: <Package className="h-3 w-3" /> },
      pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: <Clock className="h-3 w-3" /> },
      rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: <XCircle className="h-3 w-3" /> },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} gap-1 border`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const pendingProducts = products.filter(p => p.status === 'pending');

  const handleProductAction = (product: ProductType, action: 'approve' | 'reject') => {
    setSelectedProduct(product);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const confirmProductAction = () => {
    if (!selectedProduct || !approvalAction) return;

    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id 
        ? { ...p, status: approvalAction === 'approve' ? 'approved' : 'rejected' }
        : p
    ));

    toast.success(
      approvalAction === 'approve' 
        ? `"${selectedProduct.name}" has been approved and is now visible to buyers.`
        : `"${selectedProduct.name}" has been rejected.`,
      { duration: 4000 }
    );

    setShowApprovalDialog(false);
    setSelectedProduct(null);
    setApprovalAction(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <motion.div 
          className="bg-gradient-to-r from-doju-navy to-doju-navy-light border-b border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-doju-lime/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-doju-lime" />
              </div>
              <Badge className="bg-doju-lime/20 text-doju-lime border-doju-lime/30">
                Admin Panel
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">Admin Dashboard</h1>
            <p className="text-primary-foreground/70 mt-1">Manage users, products, orders, and site content</p>
          </div>
        </motion.div>

        <div className="container py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-card border border-border p-1 rounded-xl flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" className="rounded-lg gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="approvals" className="rounded-lg gap-2 relative">
                <CheckCircle className="h-4 w-4" />
                Approvals
                {pendingProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                    {pendingProducts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Sales', value: formatPrice(mockStats.totalSales), icon: DollarSign, color: 'bg-green-500/10 text-green-600' },
                  { label: 'Total Orders', value: mockStats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500/10 text-blue-600' },
                  { label: 'Total Users', value: mockStats.totalUsers.toLocaleString(), icon: Users, color: 'bg-purple-500/10 text-purple-600' },
                  { label: 'Active Products', value: mockStats.totalProducts, icon: Package, color: 'bg-orange-500/10 text-orange-600' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl border border-border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-doju-lime" />
                    Top Selling Products
                  </h3>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-6">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-foreground">{product.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{product.sales} sold</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-doju-lime" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { text: 'New order #ORD-342 received', time: '2 min ago', type: 'order' },
                      { text: 'PharmaCare Ltd registered as seller', time: '15 min ago', type: 'user' },
                      { text: 'Product "O2 Concentrator" pending approval', time: '1 hour ago', type: 'product' },
                      { text: 'Order #ORD-340 marked as delivered', time: '3 hours ago', type: 'order' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-doju-lime mt-2" />
                        <div>
                          <p className="text-sm text-foreground">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Pending Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">Pending Actions</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('approvals')}
                    className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                  >
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="text-left">
                      <p className="text-2xl font-bold text-foreground">{pendingProducts.length}</p>
                      <p className="text-sm text-muted-foreground">Products to approve</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <UserCheck className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">3</p>
                      <p className="text-sm text-muted-foreground">Seller applications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <ShoppingCart className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">12</p>
                      <p className="text-sm text-muted-foreground">Orders processing</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Product Approvals</h2>
                  <p className="text-muted-foreground">Review and approve products before they appear on the marketplace</p>
                </div>
              </div>

              {pendingProducts.length > 0 ? (
                <div className="grid gap-4">
                  {pendingProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                            {getStatusBadge(product.status)}
                          </div>
                          <p className="text-muted-foreground mb-2">{product.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Seller: <span className="text-foreground font-medium">{product.seller}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Price: <span className="text-doju-lime font-medium">{formatPrice(product.price)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => {/* View details */}}
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleProductAction(product, 'reject')}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            variant="doju-primary"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleProductAction(product, 'approve')}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 rounded-2xl border border-dashed border-border"
                >
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">All caught up!</p>
                  <p className="text-muted-foreground">No products pending approval</p>
                </motion.div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                          <td className="px-6 py-4 text-foreground">{order.customer}</td>
                          <td className="px-6 py-4 font-medium text-foreground">{formatPrice(order.amount)}</td>
                          <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                          <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockUsers.map((mockUser) => (
                        <tr key={mockUser.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{mockUser.name}</td>
                          <td className="px-6 py-4 text-foreground">{mockUser.email}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="capitalize">
                              {mockUser.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(mockUser.status)}</td>
                          <td className="px-6 py-4 text-muted-foreground">{mockUser.joinDate}</td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Seller</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Views</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                          <td className="px-6 py-4 text-foreground">{product.seller}</td>
                          <td className="px-6 py-4 font-medium text-doju-lime">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                          <td className="px-6 py-4 text-muted-foreground">{product.views.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {product.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                                    onClick={() => handleProductAction(product, 'approve')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => handleProductAction(product, 'reject')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Product' : 'Reject Product'}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve'
                ? `Are you sure you want to approve "${selectedProduct?.name}"? This will make it visible to all buyers on the marketplace.`
                : `Are you sure you want to reject "${selectedProduct?.name}"? The seller will be notified and can resubmit with changes.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={approvalAction === 'approve' ? 'doju-primary' : 'destructive'}
              onClick={confirmProductAction}
            >
              {approvalAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
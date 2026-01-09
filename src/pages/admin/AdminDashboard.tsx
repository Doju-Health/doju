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
import { supabase } from '@/integrations/supabase/client';
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

interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  status: string;
  created_at: string;
  media?: { id: string; url: string; type: string }[];
  seller_email?: string;
}

// Mock data for stats (will be replaced with real data later)
const mockStats = {
  totalSales: 15420000,
  totalOrders: 342,
  totalUsers: 1250,
  activeSellers: 24,
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

const topProducts = [
  { name: 'Infrared Thermometer', sales: 203, revenue: 5176500 },
  { name: 'Finger Pulse Oximeter', sales: 156, revenue: 2964000 },
  { name: 'Classic Stethoscope III', sales: 127, revenue: 10795000 },
  { name: 'Automatic BP Monitor', sales: 89, revenue: 4628000 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);

  // Redirect if not admin - wait for roles to load
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth?admin=true');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Fetch all products for admin
  useEffect(() => {
    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Fetch media for products
        const productIds = data.map(p => p.id);
        const { data: mediaData } = await supabase
          .from('product_media')
          .select('*')
          .in('product_id', productIds);

        // Fetch seller profiles
        const sellerIds = [...new Set(data.map(p => p.seller_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, email')
          .in('user_id', sellerIds);

        const productsWithData = data.map(product => ({
          ...product,
          media: mediaData?.filter(m => m.product_id === product.id) || [],
          seller_email: profiles?.find(p => p.user_id === product.seller_id)?.email || 'Unknown'
        }));
        setProducts(productsWithData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

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

  const handleProductAction = (product: Product, action: 'approve' | 'reject') => {
    setSelectedProduct(product);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const confirmProductAction = async () => {
    if (!selectedProduct || !approvalAction) return;

    setProcessing(true);
    try {
      const newStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, status: newStatus }
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
    } catch (error: any) {
      toast.error('Failed to update product', { description: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.seller_email && p.seller_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (authLoading || loading) {
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
          <div className="container py-6 md:py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-doju-lime/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-doju-lime" />
              </div>
              <Badge className="bg-doju-lime/20 text-doju-lime border-doju-lime/30">
                Admin Panel
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">Admin Dashboard</h1>
            <p className="text-primary-foreground/70 mt-1 text-sm md:text-base">Manage users, products, orders, and site content</p>
          </div>
        </motion.div>

        <div className="container py-6 md:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
            <TabsList className="bg-card border border-border p-1 rounded-xl flex flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" className="rounded-lg gap-2 text-xs md:text-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="rounded-lg gap-2 relative text-xs md:text-sm">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Approvals</span>
                {pendingProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                    {pendingProducts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg gap-2 text-xs md:text-sm">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg gap-2 text-xs md:text-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg gap-2 text-xs md:text-sm">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 md:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Total Sales', value: formatPrice(mockStats.totalSales), icon: DollarSign, color: 'bg-green-500/10 text-green-600' },
                  { label: 'Total Orders', value: mockStats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500/10 text-blue-600' },
                  { label: 'Total Users', value: mockStats.totalUsers.toLocaleString(), icon: Users, color: 'bg-purple-500/10 text-purple-600' },
                  { label: 'Active Products', value: products.filter(p => p.status === 'approved').length, icon: Package, color: 'bg-orange-500/10 text-orange-600' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl border border-border p-4 md:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg md:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
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
                  className="bg-card rounded-2xl border border-border p-4 md:p-6"
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
                          <span className="font-medium text-foreground text-sm md:text-base">{product.name}</span>
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
                  className="bg-card rounded-2xl border border-border p-4 md:p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-doju-lime" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { text: 'New order #ORD-342 received', time: '2 min ago', type: 'order' },
                      { text: 'PharmaCare Ltd registered as seller', time: '15 min ago', type: 'user' },
                      { text: `${pendingProducts.length} products pending approval`, time: 'Now', type: 'product' },
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
                className="bg-card rounded-2xl border border-border p-4 md:p-6"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">Pending Actions</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTab('approvals')}
                    className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                  >
                    <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
                    <div className="text-left">
                      <p className="text-xl md:text-2xl font-bold text-foreground">{pendingProducts.length}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Products to approve</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-foreground">3</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Seller applications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-foreground">12</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Orders processing</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Product Approvals</h2>
                  <p className="text-muted-foreground text-sm">Review and approve products before they appear on the marketplace</p>
                </div>
              </div>

              {pendingProducts.length > 0 ? (
                <div className="grid gap-4">
                  {pendingProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border p-4 md:p-6"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image */}
                        <div className="h-32 w-full md:w-32 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                          {product.media && product.media.length > 0 ? (
                            <img 
                              src={product.media[0].url} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                              {getStatusBadge(product.status)}
                            </div>
                            <p className="text-lg font-bold text-doju-lime">{formatPrice(product.price)}</p>
                          </div>
                          
                          {product.description && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                            <span className="text-muted-foreground">Seller: {product.seller_email}</span>
                            <span className="text-muted-foreground">Stock: {product.stock}</span>
                            {product.category && (
                              <Badge variant="outline">{product.category}</Badge>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="default"
                              className="gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleProductAction(product, 'approve')}
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleProductAction(product, 'reject')}
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No products pending approval</p>
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-foreground">Orders</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-10" />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-4 text-sm font-medium text-foreground">{order.id}</td>
                          <td className="p-4 text-sm text-foreground">{order.customer}</td>
                          <td className="p-4 text-sm font-medium text-foreground">{formatPrice(order.amount)}</td>
                          <td className="p-4">{getStatusBadge(order.status)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-foreground">Users</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-4 text-sm font-medium text-foreground">{user.name}</td>
                          <td className="p-4 text-sm text-foreground">{user.email}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                          </td>
                          <td className="p-4">{getStatusBadge(user.status)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{user.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-foreground">All Products</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid gap-4">
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                          {product.media && product.media.length > 0 ? (
                            <img 
                              src={product.media[0].url} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">by {product.seller_email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">{formatPrice(product.price)}</p>
                              {getStatusBadge(product.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try a different search term' : 'No products have been uploaded yet'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Product' : 'Reject Product'}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve' 
                ? `Are you sure you want to approve "${selectedProduct?.name}"? It will become visible to all buyers.`
                : `Are you sure you want to reject "${selectedProduct?.name}"? The seller will be notified.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowApprovalDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button 
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
              onClick={confirmProductAction}
              disabled={processing}
              className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {processing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                approvalAction === 'approve' ? 'Approve' : 'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

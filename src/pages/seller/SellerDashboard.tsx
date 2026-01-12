import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  useOrders, 
  Order, 
  OrderStatus, 
  getStatusLabel, 
  getStatusColor 
} from '@/hooks/useOrders';
import { 
  Package, TrendingUp, Eye, DollarSign, Plus, 
  Upload, X, Edit, Trash2, MoreVertical, Image,
  Video, BarChart3, ShoppingCart, Users, ArrowUpRight,
  Home, Store, Settings, LogOut, Menu, Clock, CheckCircle, XCircle,
  Truck, PackageCheck, MapPin, Phone, MessageCircle
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserMessagesInbox from '@/components/chat/UserMessagesInbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import dojuLogo from '@/assets/doju-logo.jpg';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  status: string;
  created_at: string;
  media?: { id: string; url: string; type: string }[];
}

interface UploadedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const ORDER_STATUS_FLOW: OrderStatus[] = ['confirmed', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSeller, loading: authLoading, signOut } = useAuth();
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  // Note: Protection is handled by SellerProtectedRoute in App.tsx
  // This is a backup check

  // Fetch seller products
  useEffect(() => {
    if (user && isSeller) {
      fetchProducts();
    }
  }, [user, isSeller]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch media for each product
      if (data && data.length > 0) {
        const productIds = data.map(p => p.id);
        const { data: mediaData } = await supabase
          .from('product_media')
          .select('*')
          .in('product_id', productIds);

        const productsWithMedia = data.map(product => ({
          ...product,
          media: mediaData?.filter(m => m.product_id === product.id) || []
        }));
        setProducts(productsWithMedia);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const preview = URL.createObjectURL(file);
          setUploadedMedia(prev => [...prev, { file, preview, type: 'image' }]);
        }
      });
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
          const preview = URL.createObjectURL(file);
          setUploadedMedia(prev => [...prev, { file, preview, type: 'video' }]);
        }
      });
    }
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => {
      const item = prev[index];
      URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddProduct = async () => {
    if (!user || !newProduct.name || !newProduct.price) return;
    
    setSubmitting(true);
    try {
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          name: newProduct.name,
          description: newProduct.description || null,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock) || 0,
          category: newProduct.category || null,
          status: 'pending'
        })
        .select()
        .single();

      if (productError) throw productError;

      // Upload media files
      for (const media of uploadedMedia) {
        const fileExt = media.file.name.split('.').pop();
        const fileName = `${user.id}/${product.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-media')
          .upload(fileName, media.file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: publicUrl } = supabase.storage
          .from('product-media')
          .getPublicUrl(fileName);

        // Insert media record
        await supabase
          .from('product_media')
          .insert({
            product_id: product.id,
            url: publicUrl.publicUrl,
            type: media.type
          });
      }

      toast.success('Product submitted for approval!', {
        description: 'An admin will review your product shortly.'
      });

      // Reset form
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
      uploadedMedia.forEach(m => URL.revokeObjectURL(m.preview));
      setUploadedMedia([]);
      
      // Refresh products
      fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product', { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast.success('Product deleted');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete product', { description: error.message });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex < ORDER_STATUS_FLOW.length - 1) {
      return ORDER_STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    const next = getNextStatus(currentStatus);
    if (!next) return '';
    
    const labels: Record<OrderStatus, string> = {
      confirmed: 'Mark as Picked Up',
      picked_up: 'Mark as In Transit',
      in_transit: 'Mark as Out for Delivery',
      out_for_delivery: 'Mark as Delivered',
      delivered: ''
    };
    return labels[currentStatus];
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      await updateOrderStatus(orderId, nextStatus);
    }
  };

  // Filter orders for this seller
  const sellerOrders = orders.filter(order => 
    order.items?.some(item => item.seller_id === user?.id)
  );

  const pendingOrdersCount = sellerOrders.filter(o => o.status !== 'delivered').length;
  const pendingCount = products.filter(p => p.status === 'pending').length;
  const approvedCount = products.filter(p => p.status === 'approved').length;

  const sidebarLinks = [
    { icon: BarChart3, label: 'Overview', value: 'overview' },
    { icon: Package, label: 'Products', value: 'products' },
    { icon: ShoppingCart, label: 'Orders', value: 'orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { icon: MessageCircle, label: 'Messages', value: 'messages' },
    { icon: Settings, label: 'Settings', value: 'settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={dojuLogo} alt="DOJU" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <span className="text-lg font-bold text-foreground">DOJU</span>
            <p className="text-xs text-muted-foreground">Seller Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => (
          <button
            key={link.value}
            onClick={() => setActiveTab(link.value)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === link.value
                ? 'bg-doju-lime/10 text-doju-lime'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <link.icon className="h-5 w-5" />
              {link.label}
            </div>
            {link.badge && (
              <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-doju-lime text-doju-navy text-xs font-bold flex items-center justify-center">
                {link.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link to="/">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Home className="h-5 w-5" />
            Back to Store
          </button>
        </Link>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoSelect}
        className="hidden"
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {activeTab === 'overview' && 'Dashboard'}
                  {activeTab === 'products' && 'Products'}
                  {activeTab === 'orders' && 'Orders'}
                  {activeTab === 'messages' && 'Messages'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Welcome back, Seller
                </p>
              </div>
            </div>

            <Button 
              variant="doju-primary" 
              className="gap-2"
              onClick={() => setShowAddProduct(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {products.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {approvedCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {sellerOrders.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {pendingOrdersCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Delivery</p>
                </motion.div>
              </div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-border bg-card p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Orders</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {sellerOrders.length > 0 ? (
                  <div className="space-y-3">
                    {sellerOrders.slice(0, 3).map((order) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.filter(i => i.seller_id === user?.id).length} item(s)
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                )}
              </motion.div>

              {/* Recent Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-border bg-card p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Products</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('products')}>
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {products.length > 0 ? (
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                      <div 
                        key={product.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
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
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-sm text-doju-lime">{formatPrice(product.price)}</p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No products yet</p>
                    <Button 
                      variant="doju-primary" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => setShowAddProduct(true)}
                    >
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Your Orders ({sellerOrders.length})
                </h2>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doju-lime"></div>
                </div>
              ) : sellerOrders.length > 0 ? (
                <div className="space-y-4">
                  {sellerOrders.map((order) => {
                    const sellerItems = order.items?.filter(i => i.seller_id === user?.id) || [];
                    const nextStatusLabel = getNextStatusLabel(order.status);
                    
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-border bg-card overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="p-4 border-b border-border bg-muted/30">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-foreground">{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                              {nextStatusLabel && (
                                <Button
                                  variant="doju-primary"
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, order.status)}
                                >
                                  {nextStatusLabel}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4">
                          <div className="space-y-3 mb-4">
                            {sellerItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.product_image && (
                                  <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{item.product_name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-foreground">
                                  {formatPrice(item.unit_price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Info */}
                          <div className="pt-4 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-2">Delivery Information</p>
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span className="text-muted-foreground">{order.delivery_address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{order.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-sm">When customers order your products, they'll appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Your Products ({products.length})
                </h2>
                <Button 
                  variant="doju-primary" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setShowAddProduct(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {products.length > 0 ? (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{product.name}</h3>
                              <p className="text-doju-lime font-medium">{formatPrice(product.price)}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Stock: {product.stock} • {product.category || 'Uncategorized'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(product.status)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No products yet</h3>
                  <p className="text-sm mb-4">Start selling by adding your first product.</p>
                  <Button 
                    variant="doju-primary"
                    onClick={() => setShowAddProduct(true)}
                  >
                    Add Your First Product
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Messages & Notifications</h2>
              <UserMessagesInbox />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-foreground mb-6">Settings</h2>
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-muted-foreground">Settings coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Add New Product</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAddProduct(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your product will be reviewed by an admin before going live.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Product Images
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedMedia.filter(m => m.type === 'image').map((media, index) => (
                    <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden">
                      <img src={media.preview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeMedia(uploadedMedia.indexOf(media))}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="h-20 w-20 rounded-lg border-2 border-dashed border-border hover:border-doju-lime flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <Image className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add</span>
                  </button>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Product Videos (optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedMedia.filter(m => m.type === 'video').map((media, index) => (
                    <div key={index} className="relative h-20 w-32 rounded-lg overflow-hidden bg-muted">
                      <video src={media.preview} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeMedia(uploadedMedia.indexOf(media))}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="h-20 w-32 rounded-lg border-2 border-dashed border-border hover:border-doju-lime flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Video</span>
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <label className="text-sm font-medium text-foreground">Product Name</label>
                <Input
                  placeholder="e.g., Digital Blood Pressure Monitor"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Describe your product..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Price (₦)</label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Stock</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <Input
                  placeholder="e.g., Monitors, Diagnostics"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddProduct(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="doju-primary" 
                  className="flex-1"
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.price || submitting}
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-doju-navy"></div>
                  ) : (
                    'Submit for Approval'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

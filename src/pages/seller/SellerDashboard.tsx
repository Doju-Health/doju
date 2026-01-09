import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, TrendingUp, Eye, DollarSign, Plus, 
  Upload, X, Edit, Trash2, MoreVertical, Image,
  Video, BarChart3, ShoppingCart, Users, ArrowUpRight,
  Home, Store, Settings, LogOut, Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import dojuLogo from '@/assets/doju-logo.jpg';

// Mock data for seller dashboard
const mockStats = {
  totalRevenue: 2450000,
  totalSales: 156,
  totalViews: 3420,
  productsListed: 12,
  revenueChange: 12.5,
  salesChange: 8.3,
  viewsChange: 15.2,
};

const mockProducts = [
  {
    id: '1',
    name: 'Classic Stethoscope III',
    price: 85000,
    stock: 24,
    views: 580,
    sales: 32,
    status: 'active',
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Automatic BP Monitor',
    price: 52000,
    stock: 45,
    views: 420,
    sales: 28,
    status: 'active',
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'LED Otoscope Kit',
    price: 38500,
    stock: 0,
    views: 310,
    sales: 15,
    status: 'out_of_stock',
    image: '/placeholder.svg',
  },
];

const mockSalesData = [
  { day: 'Mon', sales: 12 },
  { day: 'Tue', sales: 19 },
  { day: 'Wed', sales: 15 },
  { day: 'Thu', sales: 22 },
  { day: 'Fri', sales: 28 },
  { day: 'Sat', sales: 35 },
  { day: 'Sun', sales: 25 },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleImageUpload = () => {
    // Simulate image upload
    setUploadedImages(prev => [...prev, `/placeholder.svg?${Date.now()}`]);
  };

  const handleVideoUpload = () => {
    // Simulate video upload
    setUploadedVideos(prev => [...prev, `video-${Date.now()}.mp4`]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    // Handle product submission
    console.log({ ...newProduct, images: uploadedImages, videos: uploadedVideos });
    setShowAddProduct(false);
    setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
    setUploadedImages([]);
    setUploadedVideos([]);
  };

  const maxSales = Math.max(...mockSalesData.map(d => d.sales));

  const sidebarLinks = [
    { icon: BarChart3, label: 'Overview', value: 'overview' },
    { icon: Package, label: 'Products', value: 'products' },
    { icon: ShoppingCart, label: 'Orders', value: 'orders' },
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === link.value
                ? 'bg-doju-lime/10 text-doju-lime'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
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
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
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
                    <div className="h-10 w-10 rounded-xl bg-doju-lime/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-doju-lime" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      +{mockStats.revenueChange}%
                    </Badge>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {formatPrice(mockStats.totalRevenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      +{mockStats.salesChange}%
                    </Badge>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {mockStats.totalSales}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      +{mockStats.viewsChange}%
                    </Badge>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {mockStats.totalViews.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Product Views</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card p-4 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {mockStats.productsListed}
                  </p>
                  <p className="text-sm text-muted-foreground">Products Listed</p>
                </motion.div>
              </div>

              {/* Sales Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-border bg-card p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground">Sales This Week</h3>
                    <p className="text-sm text-muted-foreground">Daily breakdown</p>
                  </div>
                  <Badge className="bg-doju-lime/10 text-doju-lime">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending Up
                  </Badge>
                </div>

                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between gap-2 h-40">
                  {mockSalesData.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full bg-doju-lime/20 rounded-t-lg relative overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.sales / maxSales) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      >
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-doju-lime rounded-t-lg"
                          style={{ height: '100%' }}
                        />
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-border bg-card p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Top Products</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('products')}>
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockProducts.slice(0, 3).map((product, index) => (
                    <div 
                      key={product.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Your Products</h2>
                  <p className="text-sm text-muted-foreground">{mockProducts.length} products listed</p>
                </div>
                <Button 
                  variant="doju-primary" 
                  className="gap-2"
                  onClick={() => setShowAddProduct(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4">
                {mockProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-4 hover:border-doju-lime/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            <p className="text-lg font-bold text-doju-lime">{formatPrice(product.price)}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{product.views} views</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{product.sales} sales</span>
                          </div>
                          <Badge className={
                            product.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }>
                            {product.status === 'active' ? 'Active' : 'Out of Stock'}
                          </Badge>
                          <span className="text-muted-foreground">Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Orders from your products will appear here</p>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Business Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Business Name</label>
                    <Input defaultValue="Medical Supplies Co." className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <Input defaultValue="business@example.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <Input defaultValue="+234 800 123 4567" className="mt-1" />
                  </div>
                  <Button variant="doju-primary">Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Add New Product</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAddProduct(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Product Images
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleImageUpload}
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
                  {uploadedVideos.map((vid, index) => (
                    <div key={index} className="relative h-20 w-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <Video className="h-6 w-6 text-muted-foreground" />
                      <button
                        onClick={() => removeVideo(index)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleVideoUpload}
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
                  disabled={!newProduct.name || !newProduct.price}
                >
                  Add Product
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

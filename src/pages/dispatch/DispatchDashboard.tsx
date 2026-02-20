import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatchAgent } from '@/hooks/useDispatchAgent';
import { 
  Truck, Clock, CheckCircle, XCircle,
  MapPin, Phone, Mail, Car, CreditCard, AlertCircle, MessageCircle, BarChart3
} from 'lucide-react';

const DispatchDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { agent, loading: agentLoading } = useDispatchAgent();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/dispatch/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!agentLoading && !agent && user) {
      navigate('/dispatch/register');
    }
  }, [agent, agentLoading, user, navigate]);

  if (authLoading || agentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  if (!agent) return null;

  const getStatusBadge = () => {
    switch (agent.status) {
      case 'pending_verification':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1">
            <Clock className="h-3 w-3" />
            Pending Verification
          </Badge>
        );
      case 'active':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1">
            <AlertCircle className="h-3 w-3" />
            Suspended
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

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
                <Truck className="h-5 w-5 text-doju-lime" />
              </div>
              {getStatusBadge()}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Dispatch Agent Dashboard
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm md:text-base">
              Welcome back, {agent.full_name}
            </p>
          </div>
        </motion.div>

        <div className="container py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Status Message */}
              {agent.status === 'pending_verification' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Your profile is under review
                      </h3>
                      <p className="text-muted-foreground">
                        We're verifying your documents and information. You will be notified once approved and can then start receiving delivery jobs.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {agent.status === 'active' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        You're approved! 🎉
                      </h3>
                      <p className="text-muted-foreground">
                        You're now eligible to receive delivery jobs. Delivery assignments will appear here when available.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {agent.status === 'rejected' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Application Rejected
                      </h3>
                      <p className="text-muted-foreground">
                        {agent.rejection_reason || 'Your application was not approved. Please contact support for more information.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-doju-lime" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{agent.home_address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-doju-lime" />
                    Delivery Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground capitalize">{agent.vehicle_type} - {agent.plate_number}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{agent.area_of_operation}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 md:col-span-2">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-doju-lime" />
                    Bank Details
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Account Name</p>
                      <p className="text-foreground font-medium">{agent.account_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="text-foreground font-medium">{agent.account_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bank</p>
                      <p className="text-foreground font-medium">{agent.bank_name}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Future: Delivery Jobs Section */}
              {agent.status === 'active' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-doju-lime" />
                    Available Deliveries
                  </h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No delivery jobs available yet.</p>
                    <p className="text-sm">Check back later for new assignments.</p>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Messages & Notifications</h2>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DispatchDashboard;

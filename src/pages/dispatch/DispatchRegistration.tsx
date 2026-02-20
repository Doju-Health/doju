import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatchAgent, VehicleType, DispatchAgentFormData } from '@/hooks/useDispatchAgent';
import { 
  Truck, ArrowRight, ArrowLeft, CheckCircle, 
  User, Phone, Mail, MapPin, Car, CreditCard,
  Upload, Camera, Bike, Building, Clock
} from 'lucide-react';

type Step = 'personal' | 'delivery' | 'bank' | 'review';

const DispatchRegistration = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { agent, loading: agentLoading, registerAsAgent } = useDispatchAgent();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<DispatchAgentFormData>({
    full_name: '',
    email: '',
    phone: '',
    home_address: '',
    area_of_operation: '',
    vehicle_type: 'bike',
    plate_number: '',
    government_id: null,
    selfie: null,
    account_name: '',
    account_number: '',
    bank_name: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DispatchAgentFormData, string>>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/dispatch/register');
    }
  }, [user, authLoading, navigate]);

  // Redirect if already registered
  useEffect(() => {
    if (agent) {
      navigate('/dispatch/dashboard');
    }
  }, [agent, navigate]);

  const steps: { id: Step; title: string; icon: React.ElementType }[] = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'delivery', title: 'Delivery Details', icon: Truck },
    { id: 'bank', title: 'Bank Details', icon: CreditCard },
    { id: 'review', title: 'Review', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof DispatchAgentFormData, string>> = {};

    switch (currentStep) {
      case 'personal':
        if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.home_address.trim()) newErrors.home_address = 'Home address is required';
        break;
      case 'delivery':
        if (!formData.area_of_operation.trim()) newErrors.area_of_operation = 'Area of operation is required';
        if (!formData.plate_number.trim()) newErrors.plate_number = 'Plate number is required';
        if (!formData.government_id) newErrors.government_id = 'Government ID is required';
        if (!formData.selfie) newErrors.selfie = 'Selfie is required';
        break;
      case 'bank':
        if (!formData.account_name.trim()) newErrors.account_name = 'Account name is required';
        if (!formData.account_number.trim()) newErrors.account_number = 'Account number is required';
        if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    const stepOrder: Step[] = ['personal', 'delivery', 'bank', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ['personal', 'delivery', 'bank', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const success = await registerAsAgent(formData);
    setSubmitting(false);
    
    if (success) {
      navigate('/dispatch/dashboard');
    }
  };

  const handleFileChange = (field: 'government_id' | 'selfie', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (file) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const vehicleOptions: { type: VehicleType; label: string; icon: React.ElementType }[] = [
    { type: 'bike', label: 'Bike', icon: Bike },
    { type: 'car', label: 'Car', icon: Car },
    { type: 'van', label: 'Van', icon: Truck },
  ];

  if (authLoading || agentLoading) {
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
                <Truck className="h-5 w-5 text-doju-lime" />
              </div>
              <Badge className="bg-doju-lime/20 text-doju-lime border-doju-lime/30">
                Dispatch Agent
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Become a Dispatch Agent
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm md:text-base">
              Join our delivery network and start earning
            </p>
          </div>
        </motion.div>

        <div className="container py-8 max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${index <= currentStepIndex 
                      ? 'bg-doju-lime text-doju-navy' 
                      : 'bg-muted text-muted-foreground'}
                  `}>
                    {index < currentStepIndex ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-8 sm:w-16 mx-2 ${
                      index < currentStepIndex ? 'bg-doju-lime' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center mt-2">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
            </p>
          </div>

          {/* Form Steps */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              {currentStep === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      👋 Let's get to know you
                    </h2>
                    <p className="text-muted-foreground">
                      Tell us about yourself to get started
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        What's your full name?
                      </Label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                        className={errors.full_name ? 'border-destructive' : ''}
                      />
                      {errors.full_name && <p className="text-sm text-destructive mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        What's your phone number?
                      </Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g., 08012345678"
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        What's your email address?
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@example.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Where do you live?
                      </Label>
                      <Input
                        value={formData.home_address}
                        onChange={(e) => setFormData(prev => ({ ...prev, home_address: e.target.value }))}
                        placeholder="Enter your home address"
                        className={errors.home_address ? 'border-destructive' : ''}
                      />
                      {errors.home_address && <p className="text-sm text-destructive mt-1">{errors.home_address}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'delivery' && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      🚚 Delivery details
                    </h2>
                    <p className="text-muted-foreground">
                      Tell us about how you'll deliver
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Which areas can you cover?
                      </Label>
                      <Input
                        value={formData.area_of_operation}
                        onChange={(e) => setFormData(prev => ({ ...prev, area_of_operation: e.target.value }))}
                        placeholder="e.g., Lagos Island, Victoria Island, Ikoyi"
                        className={errors.area_of_operation ? 'border-destructive' : ''}
                      />
                      {errors.area_of_operation && <p className="text-sm text-destructive mt-1">{errors.area_of_operation}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-3">What type of vehicle do you have?</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {vehicleOptions.map(({ type, label, icon: Icon }) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, vehicle_type: type }))}
                            className={`
                              p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                              ${formData.vehicle_type === type 
                                ? 'border-doju-lime bg-doju-lime/10' 
                                : 'border-border hover:border-doju-lime/50'}
                            `}
                          >
                            <Icon className={`h-6 w-6 ${formData.vehicle_type === type ? 'text-doju-lime' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${formData.vehicle_type === type ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        What's your plate number?
                      </Label>
                      <Input
                        value={formData.plate_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, plate_number: e.target.value }))}
                        placeholder="e.g., ABC-123-XY"
                        className={errors.plate_number ? 'border-destructive' : ''}
                      />
                      {errors.plate_number && <p className="text-sm text-destructive mt-1">{errors.plate_number}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload your Government ID
                      </Label>
                      <div className={`
                        border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                        ${errors.government_id ? 'border-destructive' : 'border-border hover:border-doju-lime/50'}
                      `}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="government-id"
                          onChange={(e) => handleFileChange('government_id', e.target.files?.[0] || null)}
                        />
                        <label htmlFor="government-id" className="cursor-pointer">
                          {formData.government_id ? (
                            <div className="flex items-center justify-center gap-2 text-doju-lime">
                              <CheckCircle className="h-5 w-5" />
                              <span>{formData.government_id.name}</span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">
                              <Upload className="h-8 w-8 mx-auto mb-2" />
                              <p>Click to upload ID</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.government_id && <p className="text-sm text-destructive mt-1">{errors.government_id}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Upload a selfie
                      </Label>
                      <div className={`
                        border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                        ${errors.selfie ? 'border-destructive' : 'border-border hover:border-doju-lime/50'}
                      `}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="selfie"
                          onChange={(e) => handleFileChange('selfie', e.target.files?.[0] || null)}
                        />
                        <label htmlFor="selfie" className="cursor-pointer">
                          {formData.selfie ? (
                            <div className="flex items-center justify-center gap-2 text-doju-lime">
                              <CheckCircle className="h-5 w-5" />
                              <span>{formData.selfie.name}</span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">
                              <Camera className="h-8 w-8 mx-auto mb-2" />
                              <p>Click to upload selfie</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.selfie && <p className="text-sm text-destructive mt-1">{errors.selfie}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'bank' && (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      💳 Bank details
                    </h2>
                    <p className="text-muted-foreground">
                      Where should we send your earnings?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Account name
                      </Label>
                      <Input
                        value={formData.account_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                        placeholder="Enter your account name"
                        className={errors.account_name ? 'border-destructive' : ''}
                      />
                      {errors.account_name && <p className="text-sm text-destructive mt-1">{errors.account_name}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Account number
                      </Label>
                      <Input
                        value={formData.account_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                        placeholder="Enter your 10-digit account number"
                        className={errors.account_number ? 'border-destructive' : ''}
                      />
                      {errors.account_number && <p className="text-sm text-destructive mt-1">{errors.account_number}</p>}
                    </div>

                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Bank name
                      </Label>
                      <Input
                        value={formData.bank_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                        placeholder="e.g., First Bank, GTBank, Access Bank"
                        className={errors.bank_name ? 'border-destructive' : ''}
                      />
                      {errors.bank_name && <p className="text-sm text-destructive mt-1">{errors.bank_name}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      ✅ Review your application
                    </h2>
                    <p className="text-muted-foreground">
                      Make sure everything looks correct
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-doju-lime" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Full Name:</div>
                        <div className="text-foreground">{formData.full_name}</div>
                        <div className="text-muted-foreground">Phone:</div>
                        <div className="text-foreground">{formData.phone}</div>
                        <div className="text-muted-foreground">Email:</div>
                        <div className="text-foreground">{formData.email}</div>
                        <div className="text-muted-foreground">Address:</div>
                        <div className="text-foreground">{formData.home_address}</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Truck className="h-4 w-4 text-doju-lime" />
                        Delivery Details
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Area:</div>
                        <div className="text-foreground">{formData.area_of_operation}</div>
                        <div className="text-muted-foreground">Vehicle:</div>
                        <div className="text-foreground capitalize">{formData.vehicle_type}</div>
                        <div className="text-muted-foreground">Plate Number:</div>
                        <div className="text-foreground">{formData.plate_number}</div>
                        <div className="text-muted-foreground">Documents:</div>
                        <div className="text-foreground flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-doju-lime" />
                          Uploaded
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-doju-lime" />
                        Bank Details
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Account Name:</div>
                        <div className="text-foreground">{formData.account_name}</div>
                        <div className="text-muted-foreground">Account Number:</div>
                        <div className="text-foreground">{formData.account_number}</div>
                        <div className="text-muted-foreground">Bank:</div>
                        <div className="text-foreground">{formData.bank_name}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {currentStep !== 'personal' ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep !== 'review' ? (
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-doju-lime text-doju-navy hover:bg-doju-lime-light"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2 bg-doju-lime text-doju-navy hover:bg-doju-lime-light"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-doju-navy" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit for Verification
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DispatchRegistration;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, Clock, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  question: string;
  placeholder: string;
  field: string;
  type: string;
}

const steps: OnboardingStep[] = [
  { question: "What's your business name?", placeholder: "Your company name", field: 'businessName', type: 'text' },
  { question: "What's your business email?", placeholder: "business@company.com", field: 'businessEmail', type: 'email' },
  { question: "What's your business phone number?", placeholder: "+1 (555) 000-0000", field: 'businessPhone', type: 'tel' },
];

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);

  const totalSteps = steps.length + 2; // +1 for documents, +1 for pending
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (!showDocumentUpload) {
      setShowDocumentUpload(true);
    }
  };

  const handleBack = () => {
    if (showPending) {
      // Can't go back from pending
      return;
    } else if (showDocumentUpload) {
      setShowDocumentUpload(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [steps[currentStep].field]: value,
    }));
  };

  const handleSubmit = () => {
    setShowPending(true);
  };

  const handleDocumentUpload = () => {
    // Simulate document upload
    setDocuments(['Business License.pdf', 'Tax Certificate.pdf']);
  };

  const currentValue = formData[steps[currentStep]?.field] || '';
  const isValid = currentValue.length > 0;

  if (showPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-doju-navy">
                <span className="text-sm font-bold text-primary-foreground">DJ</span>
              </div>
              <span className="text-xl font-bold text-foreground">Doju</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center onboarding-fade-in">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-doju-lime-pale flex items-center justify-center">
                <Clock className="h-10 w-10 text-doju-lime" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Your application is under review
            </h1>
            <p className="text-muted-foreground mb-8">
              Thanks for applying, <strong>{formData.businessName}</strong>! Our team will review your documents and get back to you within 1-2 business days.
            </p>

            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-doju-success mt-0.5" />
                  <span className="text-sm text-muted-foreground">Documents received and being verified</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground">Account approval (1-2 business days)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground">Start listing your products</span>
                </div>
              </div>
            </div>

            <Button variant="doju-primary" size="lg" className="w-full" onClick={() => navigate('/')}>
              Back to home
            </Button>

            <p className="text-sm text-muted-foreground mt-6">
              Questions? Contact us at <a href="mailto:support@doju.example" className="text-doju-lime hover:underline">support@doju.example</a>
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (showDocumentUpload) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center">
            <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md onboarding-fade-in">
            {/* Progress */}
            <div className="mb-8">
              <Progress value={((steps.length + 1) / totalSteps) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {steps.length + 1} of {totalSteps}
              </p>
            </div>

            {/* Question */}
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Upload your business documents
            </h1>
            <p className="text-muted-foreground mb-8">
              We need to verify your business. Please upload your business license and tax certificate.
            </p>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-doju-lime transition-colors mb-6"
              onClick={handleDocumentUpload}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, PNG, JPG (max 10MB each)
              </p>
            </div>

            {/* Uploaded Files */}
            {documents.length > 0 && (
              <div className="space-y-2 mb-6">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                    <CheckCircle className="h-5 w-5 text-doju-success" />
                    <span className="text-sm text-foreground">{doc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <Button
              variant="doju-primary"
              size="lg"
              className="w-full"
              disabled={documents.length === 0}
              onClick={handleSubmit}
            >
              Submit application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center">
          <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md onboarding-fade-in" key={currentStep}>
          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>

          {/* Question */}
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {steps[currentStep].question}
          </h1>

          {/* Input */}
          <Input
            type={steps[currentStep].type}
            placeholder={steps[currentStep].placeholder}
            value={currentValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="text-lg h-14 mb-6"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValid) {
                handleNext();
              }
            }}
          />

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="doju-primary"
              size="lg"
              className="flex-1"
              disabled={!isValid}
              onClick={handleNext}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-doju-lime' : 'bg-muted'
                }`}
              />
            ))}
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-2 w-2 rounded-full bg-muted" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerOnboarding;

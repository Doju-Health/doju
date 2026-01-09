import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-doju-navy">
              <span className="text-sm font-bold text-primary-foreground">DJ</span>
            </div>
            <span className="text-xl font-bold text-foreground">Doju</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="buyer">Buyer</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>

            <TabsContent value="buyer">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-email">Email</Label>
                  <Input
                    id="buyer-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-password">Password</Label>
                  <Input
                    id="buyer-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex justify-end">
                  <Link to="#" className="text-sm text-doju-lime hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" variant="doju-primary" size="lg" className="w-full">
                  Sign in
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <Link to="/onboarding/buyer" className="text-doju-lime hover:underline">
                  Create one
                </Link>
              </p>
            </TabsContent>

            <TabsContent value="seller">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seller-email">Business email</Label>
                  <Input
                    id="seller-email"
                    type="email"
                    placeholder="business@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller-password">Password</Label>
                  <Input
                    id="seller-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex justify-end">
                  <Link to="#" className="text-sm text-doju-lime hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" variant="doju-primary" size="lg" className="w-full">
                  Sign in to seller dashboard
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Want to sell on Doju?{' '}
                <Link to="/onboarding/seller" className="text-doju-lime hover:underline">
                  Apply now
                </Link>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Login;

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { AuthClient } from '@/lib/auth-client';
import { Check, ArrowLeft, Sparkles, Zap, Shield, Users, Infinity } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up authentication
    const session = AuthClient.getSession();
    if (session) {
      setIsAuthenticated(true);
      apiClient.setToken(session.token);

      // Check if there's a plan parameter to auto-trigger checkout
      const plan = searchParams.get('plan');
      if (plan && (plan === 'starter' || plan === 'pro')) {
        // Auto-trigger checkout for the selected plan
        handleSubscribe(plan);
      }
    }
  }, [searchParams]);

  const handleSubscribe = async (plan: 'starter' | 'pro') => {
    if (!isAuthenticated) {
      // Redirect to login with plan in the URL
      router.push(`/login?redirect=${encodeURIComponent(`/pricing?plan=${plan}`)}`);
      return;
    }

    setLoading(plan);
    setError(null);

    try {
      const response = await apiClient.post('/api/checkout', { plan });

      if (response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-5 py-2.5 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-primary via-primary to-primary/80 border-none text-white">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Simple Pricing
          </Badge>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] ${playfair.className} bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/70`}>
            Choose Your Plan
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you're ready to scale.<br />
            No long-term contracts. Cancel anytime.
          </p>
        </div>

        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-center font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -z-10"></div>

            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-5xl font-bold text-gray-900">£0</span>
              </div>
              <p className="text-gray-600 mt-2">Perfect for trying out</p>
            </CardHeader>

            <CardContent className="relative">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-gray-700"><strong>1 client</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-gray-700"><strong>3 total chases</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-gray-700">WhatsApp integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-gray-700">AI-powered responses</span>
                </li>
              </ul>

              <Button
                className="w-full h-11 font-semibold"
                variant="outline"
                disabled
              >
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Starter Plan */}
          <Card className="border-2 border-primary hover:border-primary/80 transition-all duration-200 shadow-xl hover:shadow-2xl relative bg-white">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary via-primary to-primary/90 border-none shadow-lg px-4 py-1 z-20">
              <Sparkles className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>

            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10"></div>

            <CardHeader className="relative pt-6">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-5xl font-bold bg-gradient-to-br from-primary via-primary to-primary/80 bg-clip-text text-transparent">£29</span>
                <span className="text-gray-600 text-lg">/month</span>
              </div>
              <p className="text-gray-600 mt-2">For growing practices</p>
            </CardHeader>

            <CardContent className="relative">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700"><strong>Up to 15 clients</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Infinity className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700"><strong>Unlimited chases</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">WhatsApp integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">AI-powered responses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">Auto-reminders</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">Google Drive integration</span>
                </li>
              </ul>

              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                onClick={() => handleSubscribe('starter')}
                disabled={loading === 'starter'}
              >
                {loading === 'starter' ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  'Get Started'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-gray-900 hover:border-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10"></div>

            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold text-white">Pro</CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-5xl font-bold text-white">£59</span>
                <span className="text-gray-300 text-lg">/month</span>
              </div>
              <p className="text-gray-300 mt-2">For established firms</p>
            </CardHeader>

            <CardContent className="relative">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-gray-900" />
                  </div>
                  <span className="text-gray-100"><strong>Up to 50 clients</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Infinity className="h-3.5 w-3.5 text-gray-900" />
                  </div>
                  <span className="text-gray-100"><strong>Unlimited chases</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-gray-900" />
                  </div>
                  <span className="text-gray-100">Everything in Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-gray-900" />
                  </div>
                  <span className="text-gray-100">Bank statement conversion</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-gray-900" />
                  </div>
                  <span className="text-gray-100">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-gray-900" />
                  </div>
                  <span className="text-gray-100">Advanced features</span>
                </li>
              </ul>

              <Button
                className="w-full h-11 bg-white hover:bg-gray-100 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                onClick={() => handleSubscribe('pro')}
                disabled={loading === 'pro'}
              >
                {loading === 'pro' ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  'Get Started'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">GDPR Compliant</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Cancel Anytime</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">5 Minute Setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pricing...</p>
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Radius, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthClient } from '@/lib/auth-client';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });

// Helper to ensure URL has protocol
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return 'http://localhost:3001';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const API_URL = ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL);

export default function RegisterPage() {
  const router = useRouter();
  const [practiceName, setPracticeName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthClient.register(practiceName, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`);
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setError('Failed to initiate Google sign-in');
      }
    } catch (err) {
      setError('Failed to initiate Google sign-in');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-emerald-600 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-white"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full border border-white"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Radius className="w-7 h-7" />
            </div>
            <span className={`text-2xl font-bold ${playfair.className}`}>Gettingdocs</span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <h1 className={`text-5xl font-bold leading-tight ${playfair.className}`}>
              Start Automating Today
            </h1>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <span className="text-xl text-white/90">5-minute setup, no credit card</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <span className="text-xl text-white/90">AI-powered WhatsApp assistant</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <span className="text-xl text-white/90">Automatic follow-ups & reminders</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} Gettingdocs. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <Card className="border-2 border-gray-200 shadow-lg bg-white">
            <CardHeader className="space-y-2 pb-8">
              <CardTitle className={`text-4xl font-bold ${playfair.className}`} style={{ color: '#212b38' }}>
                Create Account
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Get started with your free trial
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Google Sign In Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base border-2 hover:bg-gray-50"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practice-name" className="text-sm font-semibold text-gray-700">Practice Name</Label>
                  <Input
                    id="practice-name"
                    type="text"
                    placeholder="Smith & Co Accountants"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    required
                    className="h-12 border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-12 border-2"
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
                <p className="text-sm text-center text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

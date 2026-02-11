'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Playfair_Display } from "next/font/google";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Mail,
  Bot,
  Smartphone,
  Bell,
  Cloud,
  FileSpreadsheet,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  CreditCard,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { AuthClient } from "@/lib/auth-client";
import { Logo } from "@/components/Logo";
import AnimatedStepFlow from './components/AnimatedStepFlow';
import PhoneMockup from './components/PhoneMockup';

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const session = AuthClient.getSession();
    setIsAuthenticated(!!session);
  }, []);
  useEffect(() => {
    let animationFrame: number;
    let currentX = 15;
    let currentY = 75;
    let targetX = 15;
    let targetY = 75;

    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const updateEffects = (x: number, y: number) => {
      const circles = document.querySelectorAll('.concentric-circle');
      const heroSection = document.querySelector('.hero-section');

      if (!heroSection) return;

      circles.forEach((circle, index) => {
        const element = circle as HTMLElement;
        const intensity = 0.35 - (index * 0.045);
        const spotIntensity = intensity * 2.2;

        // Larger, more diffuse glow for smoother look
        element.style.background = `radial-gradient(circle 800px at ${x}% ${y}%, rgba(21,163,73,${spotIntensity}) 0%, rgba(21,163,73,${intensity}) 20%, rgba(21,163,73,${intensity * 0.3}) 40%, transparent 70%)`;
      });
    };

    const animate = () => {
      const now = Date.now();
      const time = now * 0.0003; // Slower, more graceful animation

      // Animation constrained to bottom-left 45-degree area
      // X: 5-25% (left side), Y: 65-85% (bottom area)
      const wave1 = Math.sin(time) * 8;
      const wave2 = Math.cos(time * 1.3) * 8;
      const wave3 = Math.sin(time * 0.7) * 4;

      targetX = 15 + wave1 + wave3; // Center at 15% from left
      targetY = 75 + wave2; // Center at 75% from top (bottom area)

      // Smooth interpolation for fluid motion
      const lerpFactor = 0.05; // Lower = smoother
      currentX = lerp(currentX, targetX, lerpFactor);
      currentY = lerp(currentY, targetY, lerpFactor);

      updateEffects(currentX, currentY);

      animationFrame = requestAnimationFrame(animate);
    };

    const heroSection = document.querySelector('.hero-section') as HTMLElement;
    if (heroSection) {
      animationFrame = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Logo size={32} />
              <span className="text-xl font-semibold">Gettingdocs</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
        {/* Background decorations */}
        <div className="absolute inset-0 z-0">
          {/* Concentric circles */}
          <div className="absolute inset-0">
            <div className="concentric-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full transition-all duration-75 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(21,163,73,0.15) 0%, rgba(21,163,73,0.045) 40%, transparent 70%)'
            }}></div>
            <div className="concentric-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full transition-all duration-75 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(21,163,73,0.13) 0%, rgba(21,163,73,0.039) 40%, transparent 70%)'
            }}></div>
            <div className="concentric-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] rounded-full transition-all duration-75 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(21,163,73,0.11) 0%, rgba(21,163,73,0.033) 40%, transparent 70%)'
            }}></div>
            <div className="concentric-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90rem] h-[90rem] rounded-full transition-all duration-75 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(21,163,73,0.09) 0%, rgba(21,163,73,0.027) 40%, transparent 70%)'
            }}></div>
            <div className="concentric-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110rem] h-[110rem] rounded-full transition-all duration-75 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(21,163,73,0.07) 0%, rgba(21,163,73,0.021) 40%, transparent 70%)'
            }}></div>
            <div className="concentric-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130rem] h-[130rem] rounded-full transition-all duration-75 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(21,163,73,0.05) 0%, rgba(21,163,73,0.015) 40%, transparent 70%)'
            }}></div>
          </div>

          {/* Gradient blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/3 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-8 px-5 py-2.5 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-green-600 to-emerald-600 border-none text-white">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              AI-Powered Document Collection
            </Badge>

            <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] ${playfair.className} bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/70`}>
              Never Chase Clients
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">for Documents Again</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/70 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              AI-powered WhatsApp assistant that automatically chases, collects,
              and organizes client documents while you focus on what matters.
            </p>

            {/* Phone with badges and buttons on the right */}
            <div className="grid lg:grid-cols-[1fr,auto,1fr] items-start gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Left spacer - empty on mobile, balances layout on desktop */}
              <div className="hidden lg:block"></div>

              {/* Phone Mockup - Center */}
              <div className="flex justify-center">
                <PhoneMockup />
              </div>

              {/* Badges and Buttons - Right side */}
              <div className="flex flex-col gap-8 justify-center lg:justify-start lg:pt-32">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">5 minute setup</div>
                      <div className="text-sm text-muted-foreground">Get started instantly</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">No credit card</div>
                      <div className="text-sm text-muted-foreground">Free trial included</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Bank-level security</div>
                      <div className="text-sm text-muted-foreground">Your data is safe</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="w-full">
                      <Button size="lg" className="w-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/register" className="w-full">
                        <Button size="lg" className="w-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          Start Free Trial
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Link href="/login" className="w-full">
                        <Button size="lg" variant="outline" className="w-full h-12 px-8 text-base hover:bg-primary/5 transition-colors border-2">
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${playfair.className}`} style={{ color: '#212b38' }}>
              You're Wasting <span style={{ color: '#15a349' }}>80+ Hours</span>
              <br />
              Every Single Month
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Chasing documents is the biggest drain on your firm's productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-xl border-2 border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all bg-white group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 group-hover:bg-red-100 transition-all">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Endless Follow-ups</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                The same WhatsApp messages. The same emails. Over and over just to get a single bank statement.
              </p>
            </div>

            <div className="relative p-8 rounded-xl border-2 border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all bg-white group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 group-hover:bg-orange-100 transition-all">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Missed Deadlines</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                VAT returns pushed back. Tax filing deadlines missed. All because a client "forgot" to respond.
              </p>
            </div>

            <div className="relative p-8 rounded-xl border-2 border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all bg-white group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-yellow-50 group-hover:bg-yellow-100 transition-all">
                  <Mail className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Lost in Email</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Documents buried in inbox threads. Files scattered across WhatsApp, email, and shared drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Animated Step Flow */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#d4fae2' }}>
        <div className="text-center mb-20">
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${playfair.className}`} style={{ color: '#212b38' }}>
            How It Actually Works
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            From client upload to organized Drive folders in six automated steps
          </p>
        </div>

        <AnimatedStepFlow />
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${playfair.className}`} style={{ color: '#212b38' }}>
              Built for Modern Accountants
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every feature designed to eliminate the grunt work and give you time back
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 group overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-3">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">Powered by Claude AI</CardTitle>
                  <p className="text-sm text-muted-foreground">Natural conversations that actually work</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Anthropic's Claude handles complex requests, understands context, and responds like a real assistant—not a bot.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 group overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-3">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">Native WhatsApp Integration</CardTitle>
                  <p className="text-sm text-muted-foreground">No app downloads required</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your clients already use WhatsApp daily. Gettingdocs meets them where they are via Twilio's enterprise infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 group overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-3">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">Intelligent Reminders</CardTitle>
                  <p className="text-sm text-muted-foreground">Set it and forget it</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Custom reminder schedules with escalation paths. Amy knows when to nudge gently and when to escalate to you.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 group overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-3">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">Automatic Cloud Sync</CardTitle>
                  <p className="text-sm text-muted-foreground">Zero manual uploads</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every received document lands directly in your Google Drive, organized by client and date automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 group overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <FileSpreadsheet className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-3">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">Smart Format Conversion</CardTitle>
                  <p className="text-sm text-muted-foreground">Ready for your workflow</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bank statements automatically converted to CSV via BankToFile. Import straight into Xero, QuickBooks, or Sage.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:border-primary/20 transition-all duration-300 border-2 group overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="mb-3">
                  <CardTitle className="text-lg font-bold text-foreground mb-1">Real-Time Dashboard</CardTitle>
                  <p className="text-sm text-muted-foreground">Full visibility, always</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track every request, response, and reminder. Know exactly which clients need a nudge at a glance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#d4fae2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${playfair.className}`} style={{ color: '#212b38' }}>
              The Numbers Don't Lie
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Real firms seeing measurable impact within the first month
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`text-7xl font-bold mb-4 ${playfair.className}`} style={{ color: '#15a349' }}>90%</div>
              <div className="text-lg font-semibold text-foreground mb-2">Less Time Chasing</div>
              <div className="text-sm text-muted-foreground">Average 80+ hours saved monthly</div>
            </div>

            <div className="text-center">
              <div className={`text-7xl font-bold mb-4 ${playfair.className}`} style={{ color: '#15a349' }}>3×</div>
              <div className="text-lg font-semibold text-foreground mb-2">Faster Collection</div>
              <div className="text-sm text-muted-foreground">Documents arrive days, not weeks</div>
            </div>

            <div className="text-center">
              <div className={`text-7xl font-bold mb-4 ${playfair.className}`} style={{ color: '#15a349' }}>100%</div>
              <div className="text-lg font-semibold text-foreground mb-2">Tracked & Organized</div>
              <div className="text-sm text-muted-foreground">Never lose a document again</div>
            </div>

            <div className="text-center">
              <div className={`text-7xl font-bold mb-4 ${playfair.className}`} style={{ color: '#15a349' }}>24/7</div>
              <div className="text-lg font-semibold text-foreground mb-2">Always Working</div>
              <div className="text-sm text-muted-foreground">Amy never sleeps or takes holidays</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-6 ${playfair.className}`} style={{ color: '#212b38' }}>
              Stop Chasing.
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Start Collecting.
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join accounting firms already saving 80+ hours per month on document collection
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transition-all">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transition-all">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-semibold border-2 hover:bg-gray-50">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-base">5 minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-base">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-base">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#f0fcf4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm" style={{ color: '#4c5663' }}>
              © {new Date().getFullYear()} Gettingdocs. All rights reserved.
            </p>
            <p className="text-sm" style={{ color: '#4c5663' }}>
              <span className={playfair.className}>Created by</span> Blue Haven Digital
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

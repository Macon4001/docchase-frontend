'use client';

import Link from "next/link";
import Image from "next/image";
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
  Sparkles,
  AlertCircle
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
              <Link href="/blog">
                <Button variant="ghost">Blog</Button>
              </Link>
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
                {/* Integration Badges */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/whatsapp-logo.png"
                        alt="WhatsApp"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </div>
                    <div className="font-semibold text-foreground whitespace-nowrap">Integrates with WhatsApp</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/google-drive-logo.png"
                        alt="Google Drive"
                        width={34}
                        height={23}
                        className="w-[34px] h-auto"
                      />
                    </div>
                    <div className="font-semibold text-foreground whitespace-nowrap">Saves to Google Drive</div>
                  </div>
                </div>

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
                      <Button size="lg" className="w-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-primary/90">
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/register" className="w-full">
                        <Button size="lg" className="w-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-primary/90">
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
      <section className="relative py-32 overflow-hidden bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
              <AlertCircle className="w-3.5 h-3.5 mr-2" />
              THE PROBLEM
            </Badge>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${playfair.className}`} style={{ color: '#212b38' }}>
              You're Wasting <span style={{ color: '#15a349' }}>80+ Hours</span>
              <br />
              Every Single Month
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Chasing documents is the biggest drain on your firm's productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Endless Follow-ups</h3>
              <p className="text-gray-600 leading-relaxed">
                The same WhatsApp messages. The same emails. Over and over just to get a single bank statement.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Missed Deadlines</h3>
              <p className="text-gray-600 leading-relaxed">
                VAT returns pushed back. Tax filing deadlines missed. All because a client "forgot" to respond.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lost in Email</h3>
              <p className="text-gray-600 leading-relaxed">
                Documents buried in inbox threads. Files scattered across WhatsApp, email, and shared drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Animated Step Flow */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#d4fae2' }}>
        <div className="text-center mb-20">
          <Badge className="mb-6 px-4 py-2 bg-white/80 text-gray-700 border-gray-300">
            <Zap className="w-3.5 h-3.5 mr-2" />
            HOW IT WORKS
          </Badge>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${playfair.className}`} style={{ color: '#212b38' }}>
            How It Actually Works
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            From client upload to organized Drive folders in six automated steps
          </p>
        </div>

        <AnimatedStepFlow />
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              FEATURES
            </Badge>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${playfair.className}`} style={{ color: '#212b38' }}>
              Built for Modern Accountants
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every feature designed to eliminate the grunt work and give you time back
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Powered by Claude AI</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Anthropic's Claude handles complex requests, understands context, and responds like a real assistant—not a bot.
              </p>
              <button className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Native WhatsApp Integration</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your clients already use WhatsApp daily. Gettingdocs meets them where they are via Twilio's enterprise infrastructure.
              </p>
              <button className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Reminders</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Custom reminder schedules with escalation paths. Amy knows when to nudge gently and when to escalate to you.
              </p>
              <button className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Cloud className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automatic Cloud Sync</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every received document lands directly in your Google Drive, organized by client and date automatically.
              </p>
              <button className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Format Conversion</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bank statements automatically converted to CSV via BankToFile. Import straight into Xero, QuickBooks, or Sage.
              </p>
              <button className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Dashboard</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Track every request, response, and reminder. Know exactly which clients need a nudge at a glance.
              </p>
              <button className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="relative py-20 overflow-hidden bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4">
              Trusted by 100+ accounting firms
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Integrates with your existing tools
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all w-full h-24">
              <Image src="/whatsapp-logo.png" alt="WhatsApp" width={100} height={100} className="w-16 h-16 object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
            <div className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all w-full h-24">
              <Image src="/google-drive-logo.png" alt="Google Drive" width={100} height={40} className="w-20 h-auto object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
            <div className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all w-full h-24">
              <div className="text-2xl font-bold text-gray-400">Xero</div>
            </div>
            <div className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all w-full h-24">
              <div className="text-2xl font-bold text-gray-400">QuickBooks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-16 text-center">
            <div>
              <div className={`text-6xl font-bold mb-2 ${playfair.className} text-gray-900`}>2021</div>
              <div className="text-base text-gray-600">Founded</div>
            </div>

            <div>
              <div className={`text-6xl font-bold mb-2 ${playfair.className} text-gray-900`}>100+</div>
              <div className="text-base text-gray-600">Accounting Firms</div>
            </div>

            <div>
              <div className={`text-6xl font-bold mb-2 ${playfair.className} text-gray-900`}>1k+</div>
              <div className="text-base text-gray-600">Documents Collected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-32 overflow-hidden bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-12 h-12 text-primary mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
              "Gettingdocs has transformed how we collect client documents. What used to take weeks now happens in days, and our team can focus on actual accounting work instead of chasing paperwork."
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <span className="text-white font-bold text-lg">SJ</span>
              </div>
              <p className="text-white font-semibold">Sarah Johnson</p>
              <p className="text-gray-400 text-sm">Head of Practice at SmithCo Accounting</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${playfair.className} text-gray-900`}>
              Stop Chasing.
              <br />
              <span className="text-primary">
                Start Collecting.
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Join 100+ accounting firms already saving 80+ hours per month on document collection
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-2 hover:bg-gray-100">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${playfair.className}`}>
            Discover the full scale of
            <br />
            <span className="text-primary">Gettingdocs capabilities</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            See how leading accounting firms are saving 80+ hours every month
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-6 text-base font-semibold bg-white text-gray-900 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="px-8 py-6 text-base font-semibold bg-white text-gray-900 hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold border-2 border-white text-white hover:bg-white/10">
                    See Pricing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#f0fcf4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm" style={{ color: '#4c5663' }}>
                © {new Date().getFullYear()} Gettingdocs. All rights reserved.
              </p>
              <p className="text-sm" style={{ color: '#4c5663' }}>
                <span className={playfair.className}>Created by</span> Blue Haven Digital
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a
                href="/privacy"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Terms & Conditions
              </a>
              <a
                href="/contact"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  Sparkles,
  Radius
} from "lucide-react";
import { useEffect } from "react";
import AnimatedStepFlow from './components/AnimatedStepFlow';

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  useEffect(() => {
    let isMouseActive = false;
    let lastMouseTime = Date.now();
    let animationFrame: number;
    let currentX = 50;
    let currentY = 50;
    let targetX = 50;
    let targetY = 50;

    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const updateEffects = (x: number, y: number) => {
      const circles = document.querySelectorAll('.concentric-circle');
      const heroSection = document.querySelector('.hero-section');
      const cursorText = document.querySelector('.cursor-reactive-text');

      if (!heroSection) return;

      circles.forEach((circle, index) => {
        const element = circle as HTMLElement;
        const intensity = 0.35 - (index * 0.045);
        const spotIntensity = intensity * 2.2;

        // Larger, more diffuse glow for smoother look
        element.style.background = `radial-gradient(circle 800px at ${x}% ${y}%, rgba(21,163,73,${spotIntensity}) 0%, rgba(21,163,73,${intensity}) 20%, rgba(21,163,73,${intensity * 0.3}) 40%, transparent 70%)`;
      });

      if (cursorText) {
        const textElement = cursorText as HTMLElement;
        // Larger spotlight with more gradual transition
        textElement.style.backgroundImage = `
          radial-gradient(circle 300px at ${x}% ${y}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.98) 20%,
            rgba(255, 255, 255, 0.7) 35%,
            rgba(21, 163, 73, 1) 55%,
            rgba(21, 163, 73, 0.8) 100%
          )
        `;
      }
    };

    const animate = () => {
      const now = Date.now();

      // If mouse hasn't moved for 1.5 seconds, start auto-animation
      if (now - lastMouseTime > 1500 && !isMouseActive) {
        const time = now * 0.0003; // Slower, more graceful animation

        // More complex motion pattern using multiple wave functions
        const wave1 = Math.sin(time) * 35;
        const wave2 = Math.cos(time * 1.3) * 20;
        const wave3 = Math.sin(time * 0.7) * 15;

        targetX = 50 + wave1 + wave3;
        targetY = 50 + wave2 + Math.cos(time * 0.5) * 18;

        // Smooth interpolation for fluid motion
        const lerpFactor = 0.05; // Lower = smoother
        currentX = lerp(currentX, targetX, lerpFactor);
        currentY = lerp(currentY, targetY, lerpFactor);

        updateEffects(currentX, currentY);
      } else if (isMouseActive) {
        // Smooth following when mouse is active
        const lerpFactor = 0.15;
        currentX = lerp(currentX, targetX, lerpFactor);
        currentY = lerp(currentY, targetY, lerpFactor);
        updateEffects(currentX, currentY);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      lastMouseTime = Date.now();

      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;

      // Reset mouse active flag after a short delay
      setTimeout(() => {
        if (Date.now() - lastMouseTime >= 1400) {
          isMouseActive = false;
        }
      }, 1500);
    };

    const heroSection = document.querySelector('.hero-section') as HTMLElement;
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove as EventListener);
      animationFrame = requestAnimationFrame(animate);

      return () => {
        heroSection.removeEventListener('mousemove', handleMouseMove as EventListener);
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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Radius className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">DocChase</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
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
              <span className="cursor-reactive-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/80 transition-colors duration-150">for Documents Again</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/70 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              AI-powered WhatsApp assistant that automatically chases, collects,
              and organizes client documents while you focus on what matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base hover:bg-primary/5 transition-colors">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge className="px-4 py-2.5" style={{ backgroundColor: '#15a349', color: 'white' }}>
                <Zap className="w-3.5 h-3.5 mr-2" />
                5 min setup
              </Badge>
              <Badge className="px-4 py-2.5" style={{ backgroundColor: '#15a349', color: 'white' }}>
                <CreditCard className="w-3.5 h-3.5 mr-2" />
                No credit card
              </Badge>
              <Badge className="px-4 py-2.5" style={{ backgroundColor: '#15a349', color: 'white' }}>
                <Shield className="w-3.5 h-3.5 mr-2" />
                Bank-level security
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 overflow-hidden border-y" style={{ backgroundColor: '#d4fae2' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#212b38' }}>
              Accountants waste <span className="text-primary">80+ hours monthly</span> chasing documents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The endless back-and-forth is killing your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative p-8 rounded-xl border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <div className="mb-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Endless Follow-ups</h3>
              <p className="text-base text-green-50 leading-relaxed">
                Sending the same messages over and over to get basic documents
              </p>
            </div>

            <div className="relative p-8 rounded-xl border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <div className="mb-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Missed Deadlines</h3>
              <p className="text-base text-green-50 leading-relaxed">
                VAT returns and tax filings delayed because clients forgot
              </p>
            </div>

            <div className="relative p-8 rounded-xl border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <div className="mb-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
                  <Mail className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lost in Email</h3>
              <p className="text-base text-green-50 leading-relaxed">
                Documents scattered everywhere making tracking impossible
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Animated Step Flow */}
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#15a349', color: 'white' }}>
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#212b38' }}>
            See Amy in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how documents flow seamlessly from request to delivery
          </p>
        </div>

        <AnimatedStepFlow />
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#d4fae2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#15a349', color: 'white' }}>
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#212b38' }}>
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Automate document collection end-to-end
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none shadow-xl group overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl text-white">AI-Powered</CardTitle>
                  <Badge className="text-xs bg-white/20 text-white border-none">Claude</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-50 leading-relaxed">
                  Claude AI understands context and keeps conversations natural
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none shadow-xl group overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl text-white">WhatsApp Native</CardTitle>
                  <Badge className="text-xs bg-white/20 text-white border-none">Twilio</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-50 leading-relaxed">
                  Clients already use it. No new apps to download or learn
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none shadow-xl group overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl text-white">Smart Reminders</CardTitle>
                  <Badge className="text-xs bg-white/20 text-white border-none">Auto</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-50 leading-relaxed">
                  Configurable follow-ups with gentle, professional messaging
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none shadow-xl group overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <Cloud className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl text-white">Google Drive Sync</CardTitle>
                  <Badge className="text-xs bg-white/20 text-white border-none">Live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-50 leading-relaxed">
                  Every document automatically uploaded and organized
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none shadow-xl group overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <FileSpreadsheet className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl text-white">PDF to CSV</CardTitle>
                  <Badge className="text-xs bg-white/20 text-white border-none">BankToFile</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-50 leading-relaxed">
                  Bank statements converted for easy accounting software import
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none shadow-xl group overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl text-white">Live Dashboard</CardTitle>
                  <Badge className="text-xs bg-white/20 text-white border-none">Real-time</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-50 leading-relaxed">
                  See exactly who responded and who needs attention
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#212b38' }}>
              Proven Results
            </h2>
            <p className="text-xl text-gray-600">Real impact for accounting firms</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl font-bold text-primary mb-2">90%</div>
                <div className="text-sm font-medium text-muted-foreground">Less Time Chasing</div>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl font-bold text-primary mb-2">3x</div>
                <div className="text-sm font-medium text-muted-foreground">Faster Collection</div>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm font-medium text-muted-foreground">Tracked & Organized</div>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm font-medium text-muted-foreground">Always Working</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#d4fae2' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 border-none shadow-2xl overflow-hidden">
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Reclaim Your Time?
              </h2>
              <p className="text-lg sm:text-xl text-green-50 mb-8 max-w-2xl mx-auto">
                Join accountants who've automated their document collection
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Link href="/register">
                  <Button size="lg" className="h-11 w-full max-w-md sm:w-auto bg-white hover:bg-gray-100 text-green-600 font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-xl rounded-xl">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Start Your Free Trial
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 text-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">5 min setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
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
              © {new Date().getFullYear()} DocChase. All rights reserved.
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

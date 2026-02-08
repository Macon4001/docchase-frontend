'use client';

import { useEffect, useState } from 'react';
import { User, MessageSquare, FileText, Save, Repeat, CheckCircle } from 'lucide-react';

// Actor color palette
const actorColors = {
  you: {
    primary: '#3B82F6',      // Blue
    light: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    gradient: 'from-blue-500 to-cyan-500'
  },
  amy: {
    primary: '#10B981',      // Green
    light: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    gradient: 'from-green-500 to-emerald-500'
  },
  client: {
    primary: '#F59E0B',      // Orange
    light: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    gradient: 'from-orange-500 to-amber-500'
  }
};

interface FlowStep {
  id: number;
  icon: typeof User;
  title: string;
  description: string;
  actor: 'you' | 'amy' | 'client';
}

const flowSteps: FlowStep[] = [
  {
    id: 1,
    icon: User,
    title: "Add Clients",
    description: "Upload CSV or add manually",
    actor: "you"
  },
  {
    id: 2,
    icon: MessageSquare,
    title: "Amy Chases",
    description: "WhatsApp messages + auto reminders",
    actor: "amy"
  },
  {
    id: 3,
    icon: FileText,
    title: "Client Sends",
    description: "Photo or PDF via WhatsApp",
    actor: "client"
  },
  {
    id: 4,
    icon: Save,
    title: "Amy Saves",
    description: "PDF saved to your Google Drive",
    actor: "amy"
  },
  {
    id: 5,
    icon: Repeat,
    title: "Amy Converts",
    description: "PDF → CSV automatically",
    actor: "amy"
  },
  {
    id: 6,
    icon: CheckCircle,
    title: "You're Notified",
    description: "Statement ready in your Drive",
    actor: "you"
  }
];

export default function HowItWorksFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Animate through steps
            flowSteps.forEach((_, index) => {
              setTimeout(() => {
                setActiveStep(index);
              }, index * 600);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('how-it-works-flow');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated]);

  return (
    <div id="how-it-works-flow" className="relative w-full max-w-7xl mx-auto py-16 px-4">
      {/* Mobile View - Vertical Stack */}
      <div className="md:hidden space-y-6">
        {flowSteps.map((step, index) => {
          const colors = actorColors[step.actor];
          const Icon = step.icon;
          const isActive = hasAnimated && index <= activeStep;

          return (
            <div
              key={step.id}
              className={`relative transition-all duration-700 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Connecting Line */}
              {index < flowSteps.length - 1 && (
                <div className="absolute left-10 top-24 w-0.5 h-10 bg-gradient-to-b from-gray-300 to-transparent"></div>
              )}

              {/* Step Card */}
              <div className="flex items-start gap-4">
                {/* Icon Container */}
                <div className="relative flex-shrink-0">
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                    style={{ background: colors.primary }}
                  ></div>
                  <div
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  {/* Step Number */}
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-md"
                    style={{ background: colors.primary }}
                  >
                    {step.id}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-2"
                    style={{
                      background: colors.light,
                      color: colors.primary,
                      border: `2px solid ${colors.border}`
                    }}
                  >
                    {step.actor === 'you' ? 'You' : step.actor === 'amy' ? 'Amy' : 'Client'}
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#212b38' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - Horizontal Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connecting Line Container */}
          <div className="absolute top-16 left-0 right-0 flex items-center justify-between px-16 pointer-events-none">
            {flowSteps.slice(0, -1).map((step, index) => {
              const nextStep = flowSteps[index + 1];
              const fromColors = actorColors[step.actor];
              const toColors = actorColors[nextStep.actor];
              const isActive = hasAnimated && index < activeStep;

              return (
                <div key={`connector-${index}`} className="flex-1 relative h-2 mx-4">
                  {/* Base line */}
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>

                  {/* Animated gradient line */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000`}
                    style={{
                      background: `linear-gradient(90deg, ${fromColors.primary} 0%, ${toColors.primary} 100%)`,
                      width: isActive ? '100%' : '0%',
                      boxShadow: isActive ? `0 0 20px ${fromColors.primary}40` : 'none'
                    }}
                  ></div>

                  {/* Flowing dot */}
                  {isActive && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-flowDot"
                      style={{
                        background: toColors.primary,
                        boxShadow: `0 0 10px ${toColors.primary}`,
                        animation: 'flowDot 1.5s ease-in-out infinite'
                      }}
                    ></div>
                  )}

                  {/* Arrow */}
                  <div
                    className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                  >
                    <div
                      className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-b-[8px] border-b-transparent"
                      style={{ borderLeftColor: toColors.primary }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Steps */}
          <div className="flex items-start justify-between relative z-10">
            {flowSteps.map((step, index) => {
              const colors = actorColors[step.actor];
              const Icon = step.icon;
              const isActive = hasAnimated && index <= activeStep;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center max-w-[140px] transition-all duration-700 ${
                    isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Icon Container */}
                  <div className="relative mb-6 group cursor-pointer">
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl blur-2xl transition-opacity duration-700 ${
                        isActive ? 'opacity-50' : 'opacity-0'
                      }`}
                      style={{ background: colors.primary }}
                    ></div>

                    {/* Icon Box */}
                    <div
                      className={`relative w-32 h-32 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-xl transition-all duration-500 hover:scale-110 hover:rotate-3`}
                      style={{
                        boxShadow: isActive
                          ? `0 20px 40px -10px ${colors.primary}60`
                          : '0 10px 20px -5px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Icon className="w-16 h-16 text-white" />
                    </div>

                    {/* Step Number Badge */}
                    <div
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-full text-white font-bold text-lg flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform"
                      style={{ background: colors.primary }}
                    >
                      {step.id}
                    </div>
                  </div>

                  {/* Actor Badge */}
                  <div
                    className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-3 shadow-sm"
                    style={{
                      background: colors.light,
                      color: colors.primary,
                      border: `2px solid ${colors.border}`
                    }}
                  >
                    {step.actor === 'you' ? 'You' : step.actor === 'amy' ? 'Amy' : 'Client'}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-2 text-center"
                    style={{ color: '#212b38' }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes flowDot {
          0% {
            left: 0%;
            opacity: 0;
            transform: translateY(-50%) scale(0.5);
          }
          10% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          100% {
            left: 100%;
            opacity: 0;
            transform: translateY(-50%) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}

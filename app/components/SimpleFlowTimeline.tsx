'use client';

import { ArrowRight, UserPlus, MessageSquare, FileText, Save, Repeat, CheckCircle } from 'lucide-react';

interface Step {
  actor: string;
  action: string;
  color: string;
  icon: typeof UserPlus;
}

const steps: Step[] = [
  { actor: 'You', action: 'Add Clients', color: '#3B82F6', icon: UserPlus },
  { actor: 'Amy', action: 'Chases', color: '#10B981', icon: MessageSquare },
  { actor: 'Client', action: 'Sends PDF', color: '#F59E0B', icon: FileText },
  { actor: 'Amy', action: 'Saves', color: '#10B981', icon: Save },
  { actor: 'Amy', action: 'Converts', color: '#10B981', icon: Repeat },
  { actor: 'You', action: 'Get CSV', color: '#3B82F6', icon: CheckCircle }
];

export default function SimpleFlowTimeline() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Mobile - Vertical */}
      <div className="md:hidden space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${step.color}20`, border: `2px solid ${step.color}` }}
              >
                <Icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold" style={{ color: step.color }}>
                  {step.actor}
                </div>
                <div className="text-sm font-bold text-gray-800">{step.action}</div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop - Horizontal */}
      <div className="hidden md:flex items-center justify-center gap-3 lg:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center gap-3 lg:gap-4">
              {/* Step Box */}
              <div className="group relative">
                <div
                  className="relative bg-white rounded-2xl p-4 lg:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:scale-105 min-w-[120px] lg:min-w-[140px]"
                  style={{ borderColor: step.color }}
                >
                  {/* Actor Badge */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md whitespace-nowrap"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.actor}
                  </div>

                  {/* Lucide Icon */}
                  <div className="mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-12 h-12 lg:w-14 lg:h-14" style={{ color: step.color }} />
                  </div>

                  {/* Action Text */}
                  <div className="text-center">
                    <div className="text-sm lg:text-base font-bold text-gray-800">
                      {step.action}
                    </div>
                  </div>

                  {/* Step Number */}
                  <div
                    className="absolute -bottom-3 right-3 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="flex items-center">
                  <ArrowRight
                    className="w-6 h-6 lg:w-8 lg:h-8 animate-pulse"
                    style={{ color: steps[index + 1].color }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtitle */}
      <div className="text-center mt-8 text-sm text-gray-600 font-medium">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          You
          <span className="mx-2">•</span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Amy
          <span className="mx-2">•</span>
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          Client
        </span>
      </div>
    </div>
  );
}

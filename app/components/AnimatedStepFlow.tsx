'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, MessageSquare, FileText, Save, Repeat, CheckCircle, Upload, FolderOpen, Sparkles } from 'lucide-react';

interface StepProps {
  number: number;
  actor: 'you' | 'amy' | 'client';
  title: string;
  description: string;
  icon: typeof UserPlus;
  animationComponent: React.ReactNode;
  reverse?: boolean;
}

const actorColors = {
  you: { primary: '#3B82F6', light: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' },
  amy: { primary: '#10B981', light: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' },
  client: { primary: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' }
};

function StepSection({ number, actor, title, description, icon: Icon, animationComponent, reverse = false }: StepProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const colors = actorColors[actor];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const cardContent = (
    <div
      className={`flex-1 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${reverse ? 'translate-x-12' : '-translate-x-12'}`
      }`}
      style={{ transitionDelay: '200ms' }}
    >
      <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-shadow border-2" style={{ borderColor: colors.primary }}>
        {/* Step number in top-right corner */}
        <div
          className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
          style={{ background: colors.primary }}
        >
          <span className="text-2xl font-bold text-white">{number}</span>
        </div>

        {/* Header: Icon + Actor Badge combined */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: colors.primary }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <div
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
              style={{
                background: colors.light,
                color: colors.primary,
                border: `2px solid ${colors.border}`
              }}
            >
              {actor === 'you' ? 'You' : actor === 'amy' ? 'Amy' : 'Client'}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#212b38' }}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Bottom accent line */}
        <div className="mt-8 h-1 w-20 rounded-full" style={{ background: colors.primary }}></div>
      </div>
    </div>
  );

  const animationContent = (
    <div
      className={`flex-1 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${reverse ? '-translate-x-12' : 'translate-x-12'}`
      }`}
      style={{ transitionDelay: '400ms' }}
    >
      {animationComponent}
    </div>
  );

  return (
    <div ref={sectionRef} className="relative py-16 lg:py-24">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}>
        {cardContent}
        {animationContent}
      </div>
    </div>
  );
}

// Animation Components
function AddClientsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 shadow-xl min-h-[500px] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* CSV Upload Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors animate-[pulse_3s_ease-in-out_infinite]">
          <div className="text-center">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-[bounce_2s_ease-in-out_infinite]" />
            <div className="text-lg font-bold text-gray-800 mb-2">Upload Client List</div>
            <div className="text-sm text-gray-500">CSV or Excel file</div>
          </div>
        </div>

        {/* Sample Data Rows */}
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 animate-[slideInRight_0.6s_ease-out]"
              style={{ animationDelay: `${i * 0.3}s`, animationFillMode: 'both' }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AmySendsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 shadow-xl min-h-[500px] flex items-center justify-center">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-lg animate-[fadeInScale_0.6s_ease-out]"
            style={{ animationDelay: `${i * 0.2}s`, animationFillMode: 'both' }}
          >
            {/* Phone-like container */}
            <div className="bg-[#25D366] rounded-t-xl px-3 py-2 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-semibold">Client {i}</span>
            </div>
            <div className="bg-[#e5ddd5] rounded-b-xl p-3 min-h-[80px]">
              <div className="bg-white rounded-lg rounded-bl-none p-2 shadow-sm">
                <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <CheckCircle className="w-4 h-4 text-blue-500 animate-[ping_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientRespondsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-12 shadow-xl min-h-[500px] flex items-center justify-center">
      {/* Phone mockup with better proportions */}
      <div className="relative w-full max-w-md">
        {/* Phone frame shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 rounded-[2.5rem] blur-xl opacity-40"></div>

        {/* Phone container */}
        <div className="relative bg-gradient-to-b from-gray-100 to-gray-50 rounded-[2.5rem] p-3 shadow-2xl">
          {/* Phone screen */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner">
            {/* WhatsApp header */}
            <div className="bg-[#075E54] px-5 py-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base text-white">John Smith</div>
                <div className="text-xs text-white/90 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>online</span>
                </div>
              </div>
            </div>

            {/* Chat background */}
            <div className="p-5 min-h-[320px] space-y-4 relative" style={{
              backgroundImage: "url('/whatsapp background .png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>

              {/* Messages container */}
              <div className="relative space-y-3">
                {/* Amy's message */}
                <div className="flex gap-2 items-end animate-[fadeIn_0.6s_ease-out]">
                  <div className="max-w-[80%]">
                    <div className="bg-white rounded-lg rounded-bl-sm p-3 shadow-sm">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Hi John! Could you send over your January 2024 bank statement? 📄
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">10:30 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client typing indicator */}
                <div className="flex gap-2 items-end justify-end animate-[slideInRight_0.8s_ease-out_0.8s_both]">
                  <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>

                {/* File upload message */}
                <div className="flex gap-2 items-end justify-end animate-[slideInRight_0.8s_ease-out_1.6s_both]">
                  <div className="max-w-[80%]">
                    <div className="bg-[#DCF8C6] rounded-lg rounded-br-sm p-3 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <FileText className="w-7 h-7 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">bank_statement_jan.pdf</div>
                          <div className="text-xs text-gray-500">248 KB • PDF</div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1 bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 animate-[progress_2s_ease-out]" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <span className="text-[10px] text-gray-600">10:32 AM</span>
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message input bar */}
            <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-3">
              <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400">
                Type a message
              </div>
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmySavesAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 shadow-xl min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-2xl">
        {/* Top section: Document transfer animation */}
        <div className="relative mb-12 h-32">
          {/* Source document */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <FileText className="w-16 h-16 text-orange-500" />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm">
                PDF Received
              </span>
            </div>
          </div>

          {/* Destination - Google Drive */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative">
                <FolderOpen className="w-16 h-16 text-green-500" />
                {/* Success ping */}
                <div className="absolute -top-1 -right-1">
                  <div className="relative">
                    <div className="w-6 h-6 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center relative">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full shadow-sm">
                Saved to Drive
              </span>
            </div>
          </div>

          {/* Connecting line with animated dot blob */}
          <div className="absolute top-1/2 left-24 right-24 h-0.5 -translate-y-1/2 border-t-2 border-dashed border-green-300">
            <div className="relative w-full h-full">
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full shadow-lg animate-[flyToRight_3s_ease-in-out_infinite]"
                style={{ filter: 'blur(2px)', left: '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom section: Google Drive folder structure */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Drive header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-base">Google Drive</div>
              <div className="text-white/80 text-xs">DocChase / 2024 / January</div>
            </div>
          </div>

          {/* File list */}
          <div className="p-6 space-y-3">
            {[
              { name: 'john_smith_jan.pdf', time: '2 mins ago', status: 'complete' },
              { name: 'sarah_jones_jan.pdf', time: '5 mins ago', status: 'complete' },
              { name: 'mike_wilson_jan.pdf', time: '8 mins ago', status: 'complete' }
            ].map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group animate-[slideInRight_0.6s_ease-out]"
                style={{ animationDelay: `${i * 0.2}s`, animationFillMode: 'both' }}
              >
                {/* File icon */}
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-orange-500" />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.time}</div>
                </div>

                {/* Status badge */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Synced
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer summary */}
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">3 files</span> uploaded today
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Auto-sync enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmyConvertsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 shadow-xl min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Animated particles in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-300 rounded-full opacity-40 animate-[float_4s_ease-in-out_infinite]"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.7}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Main conversion display */}
        <div className="flex items-center justify-between gap-8 mb-12">
          {/* Source PDF */}
          <div className="flex-1 animate-[fadeIn_0.8s_ease-out]">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex flex-col items-center gap-4">
                {/* PDF Document preview */}
                <div className="relative w-32 h-40 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 shadow-lg overflow-hidden">
                  {/* Document lines */}
                  <div className="absolute inset-0 p-4 space-y-2">
                    <div className="h-2 bg-red-200 rounded w-3/4"></div>
                    <div className="h-2 bg-red-200 rounded w-full"></div>
                    <div className="h-2 bg-red-200 rounded w-5/6"></div>
                    <div className="h-8 bg-red-300 rounded w-full mt-4"></div>
                    <div className="h-2 bg-red-200 rounded w-2/3"></div>
                    <div className="h-2 bg-red-200 rounded w-full"></div>
                  </div>
                  {/* PDF icon overlay */}
                  <div className="absolute top-2 right-2 bg-red-500 rounded-lg p-1">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">Bank Statement</div>
                  <div className="text-xs text-gray-500">PDF Document</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transformation animation */}
          <div className="flex flex-col items-center gap-3 animate-[fadeIn_0.8s_ease-out_0.4s_both]">
            {/* Processing badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 shadow-xl">
                <Repeat className="w-8 h-8 text-white animate-[spin_3s_linear_infinite]" />
              </div>
            </div>

            {/* Sparkle effects */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <Sparkles
                  key={i}
                  className="w-5 h-5 text-emerald-400 animate-[ping_1.5s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>

            {/* API badge */}
            <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-green-600">BankToFile API</span>
              </div>
            </div>

            {/* Processing status */}
            <div className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">
              Converting...
            </div>
          </div>

          {/* Destination CSV */}
          <div className="flex-1 animate-[fadeIn_0.8s_ease-out_0.8s_both]">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex flex-col items-center gap-4">
                {/* CSV Spreadsheet preview */}
                <div className="relative w-32 h-40 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-lg overflow-hidden">
                  {/* Spreadsheet grid */}
                  <div className="absolute inset-0">
                    {/* Header row */}
                    <div className="flex h-8 bg-green-500">
                      <div className="flex-1 border-r border-green-600 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">Date</span>
                      </div>
                      <div className="flex-1 border-r border-green-600 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">Desc</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">£</span>
                      </div>
                    </div>
                    {/* Data rows */}
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex h-6 border-b border-green-200 bg-white/80">
                        <div className="flex-1 border-r border-green-200 px-1">
                          <div className="h-2 bg-green-300 rounded mt-2 w-full"></div>
                        </div>
                        <div className="flex-1 border-r border-green-200 px-1">
                          <div className="h-2 bg-green-300 rounded mt-2 w-3/4"></div>
                        </div>
                        <div className="flex-1 px-1">
                          <div className="h-2 bg-green-300 rounded mt-2 w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* CSV icon overlay */}
                  <div className="absolute top-2 right-2 bg-green-500 rounded-lg p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">Transactions</div>
                  <div className="text-xs text-gray-500">CSV Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-[slideInDown_0.8s_ease-out_1.2s_both]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Processing bank statement...</div>
                <div className="text-xs text-gray-500">Extracting transactions</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-green-600">2.4s</div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-[progress_3s_ease-out]" style={{ width: '0%' }}></div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-gray-600">48 transactions found</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-gray-600">Ready for import</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YouNotifiedAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 shadow-xl min-h-[500px] flex items-center justify-center">
      {/* Dashboard mockup */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Dashboard header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
          <div className="text-white font-bold text-lg">DocChase Dashboard</div>
        </div>

        {/* Notification toast appearing */}
        <div className="p-6">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 shadow-lg animate-[slideInDown_0.8s_ease-out]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 mb-1">Document Received! 🎉</div>
                <div className="text-sm text-gray-600">John Smith's January statement is ready</div>
              </div>
            </div>
          </div>

          {/* Recent activity list */}
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors animate-[fadeIn_0.6s_ease-out]"
                style={{ animationDelay: `${i * 0.3}s`, animationFillMode: 'both' }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Client {i} responded</div>
                  <div className="text-xs text-gray-500">{i * 2} hours ago</div>
                </div>
                <div className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">Complete</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnimatedStepFlow() {
  const steps: StepProps[] = [
    {
      number: 1,
      actor: 'you',
      title: 'Add Your Clients',
      description: 'Upload a CSV file with your client list or add them manually. Takes less than 5 minutes to set up your entire client base.',
      icon: UserPlus,
      animationComponent: <AddClientsAnimation />,
      reverse: false
    },
    {
      number: 2,
      actor: 'amy',
      title: 'Amy Sends Messages',
      description: 'Personalized WhatsApp messages go out automatically to each client. No manual work required from you.',
      icon: MessageSquare,
      animationComponent: <AmySendsAnimation />,
      reverse: true
    },
    {
      number: 3,
      actor: 'client',
      title: 'Client Responds',
      description: 'Your clients simply reply with a photo or PDF of their bank statement. Easy for them, effortless for you.',
      icon: FileText,
      animationComponent: <ClientRespondsAnimation />,
      reverse: false
    },
    {
      number: 4,
      actor: 'amy',
      title: 'Amy Saves to Drive',
      description: 'Every document is automatically uploaded to your Google Drive in an organized folder structure. Never lose a file again.',
      icon: Save,
      animationComponent: <AmySavesAnimation />,
      reverse: true
    },
    {
      number: 5,
      actor: 'amy',
      title: 'Amy Converts to CSV',
      description: 'Bank statements are automatically converted using BankToFile API, ready for immediate import into your accounting software.',
      icon: Repeat,
      animationComponent: <AmyConvertsAnimation />,
      reverse: false
    },
    {
      number: 6,
      actor: 'you',
      title: "You're Notified",
      description: 'Get instant notifications when documents arrive. Track everything in your real-time dashboard.',
      icon: CheckCircle,
      animationComponent: <YouNotifiedAnimation />,
      reverse: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {steps.map((step) => (
        <StepSection key={step.number} {...step} />
      ))}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes flyToRight {
          0%, 100% {
            transform: translateX(-50px) translateY(-50%) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            transform: translateX(50px) translateY(-70%) rotate(10deg);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(150px) translateY(-50%) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes flowDown {
          0% {
            top: 0%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

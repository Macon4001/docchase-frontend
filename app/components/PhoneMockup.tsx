'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

export default function PhoneMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 1000, nextStep: 1 },
      { delay: 2000, nextStep: 2 },
      { delay: 1500, nextStep: 3 },
      { delay: 2000, nextStep: 4 },
      { delay: 1000, nextStep: 5 },
      { delay: 2000, nextStep: 6 },
      { delay: 3000, nextStep: 0 },
    ];

    const timer = setTimeout(() => {
      const current = sequence[step];
      if (current) {
        setStep(current.nextStep);
      }
    }, sequence[step]?.delay || 1000);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      {/* Green glow effects around phone */}
      <div className="absolute inset-0 -m-12">
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      {/* iPhone frame */}
      <div className="relative bg-black rounded-[55px] p-[3px] shadow-2xl">
        <div className="relative bg-white rounded-[52px] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[40px] z-50"></div>

          {/* Status bar */}
          <div className="relative bg-[#075e54] text-white px-8 pt-[52px] pb-2 flex items-center justify-between text-xs z-40">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-6 h-3 border border-white rounded-sm flex items-center px-[2px]">
                <div className="w-4 h-2 bg-white rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* WhatsApp header */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <div className="font-semibold text-[15px]">Amy</div>
                <div className="text-[11px] text-green-100">online</div>
              </div>
            </div>
          </div>

          {/* WhatsApp background */}
          <div
            className="relative w-[360px] h-[600px] overflow-hidden"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d5cc' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            <div className="px-3 pt-4 pb-20 space-y-2 min-h-[500px]">
              {/* Amy typing */}
              {step === 1 && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Amy's message */}
              {step >= 2 && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[75%] shadow-sm">
                    <p className="text-sm text-gray-800">Hi Dave! Could you send your January bank statement?</p>
                    <div className="text-[11px] text-gray-500 mt-1 text-right">10:32</div>
                  </div>
                </div>
              )}

              {/* Dave typing */}
              {step === 3 && (
                <div className="flex justify-end">
                  <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dave's reply */}
              {step >= 4 && (
                <div className="flex justify-end animate-fadeIn">
                  <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none px-3 py-2 max-w-[75%] shadow-sm">
                    <p className="text-sm text-gray-800 mb-2">Here you go mate</p>
                    <div className="flex items-center gap-2 bg-white/80 rounded-md px-3 py-2 border border-gray-200">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">January_Statement.pdf</div>
                        <div className="text-[11px] text-gray-500">124 KB</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1 text-right">10:35</div>
                  </div>
                </div>
              )}

              {/* Amy typing again */}
              {step === 5 && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Amy's thank you */}
              {step >= 6 && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[75%] shadow-sm">
                    <p className="text-sm text-gray-800">Got it, thanks Dave! All saved ✓</p>
                    <div className="text-[11px] text-gray-500 mt-1 text-right">10:36</div>
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#f0f2f5] px-2 py-2 border-t border-gray-300">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-4 py-2">
                  <span className="text-sm text-gray-400">Type a message</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

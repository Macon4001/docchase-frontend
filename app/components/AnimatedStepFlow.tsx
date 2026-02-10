'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, MessageSquare, FileText, Save, Repeat, CheckCircle, Upload, FolderOpen, Bell } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });

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
  you: {
    primary: '#15a349',
    light: 'rgba(21, 163, 73, 0.08)',
    border: 'rgba(21, 163, 73, 0.2)',
    text: '#15a349'
  },
  amy: {
    primary: '#15a349',
    light: 'rgba(21, 163, 73, 0.08)',
    border: 'rgba(21, 163, 73, 0.2)',
    text: '#15a349'
  },
  client: {
    primary: '#15a349',
    light: 'rgba(21, 163, 73, 0.08)',
    border: 'rgba(21, 163, 73, 0.2)',
    text: '#15a349'
  }
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
      <div className="relative bg-white rounded-2xl p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100">
        {/* Step number badge */}
        <div className="flex items-start gap-6 mb-6">
          <div
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: colors.primary }}
          >
            <span className={`text-2xl font-bold text-white ${playfair.className}`}>{number}</span>
          </div>
          <div className="flex-1">
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{
                backgroundColor: colors.light,
                color: colors.text,
                border: `1px solid ${colors.border}`
              }}
            >
              {actor === 'you' ? 'You' : actor === 'amy' ? 'Amy' : 'Client'}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-3xl lg:text-4xl font-bold mb-4 ${playfair.className}`} style={{ color: '#212b38' }}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-gray-600 leading-relaxed">
          {description}
        </p>
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
    <div ref={sectionRef} className="relative py-12 lg:py-16">
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
    <div className="relative bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-10 shadow-lg min-h-[400px] flex items-center justify-center border border-gray-100">
      <div className="w-full max-w-md">
        {/* CSV Upload Area */}
        <div className="bg-white rounded-xl p-8 shadow-md border-2 border-dashed border-gray-300 hover:border-primary/40 transition-colors">
          <div className="text-center">
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-base font-semibold text-gray-800 mb-2">Upload Client List</div>
            <div className="text-sm text-gray-500">CSV or Excel file</div>
          </div>
        </div>

        {/* Sample Data Rows */}
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3 border border-gray-100 animate-[slideIn_0.6s_ease-out]"
              style={{ animationDelay: `${i * 0.2}s`, animationFillMode: 'both' }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
              </div>
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AmySendsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-10 shadow-lg min-h-[400px] flex items-center justify-center border border-gray-100">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 animate-[fadeInScale_0.6s_ease-out]"
            style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}
          >
            {/* WhatsApp header */}
            <div className="bg-primary rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-semibold">Client {i}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 min-h-[70px]">
              <div className="bg-white rounded-md p-2 shadow-sm">
                <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientRespondsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-10 shadow-lg min-h-[400px] flex items-center justify-center border border-gray-100">
      <div className="relative w-full max-w-sm">
        {/* Phone container */}
        <div className="relative bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          {/* Phone screen */}
          <div className="bg-white rounded-[2rem] overflow-hidden">
            {/* WhatsApp header */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-white">John Smith</div>
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>online</span>
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="p-4 min-h-[280px] bg-[#e5ddd5] space-y-3">
              {/* Amy's message */}
              <div className="flex gap-2 items-end">
                <div className="max-w-[75%]">
                  <div className="bg-white rounded-lg rounded-bl-sm p-3 shadow-sm">
                    <p className="text-xs text-gray-800">
                      Hi John! Could you send over your January 2024 bank statement?
                    </p>
                    <div className="text-[10px] text-gray-500 mt-1 text-right">10:30 AM</div>
                  </div>
                </div>
              </div>

              {/* File upload message */}
              <div className="flex gap-2 items-end justify-end animate-[slideIn_0.8s_ease-out_0.8s_both]">
                <div className="max-w-[75%]">
                  <div className="bg-[#dcf8c6] rounded-lg rounded-br-sm p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">bank_statement.pdf</div>
                        <div className="text-[10px] text-gray-500">248 KB</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-600 flex items-center justify-end gap-1">
                      <span>10:32 AM</span>
                      <CheckCircle className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="bg-[#f0f0f0] px-3 py-2 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-gray-400">
                Type a message
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmySavesAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-10 shadow-lg min-h-[400px] flex items-center justify-center border border-gray-100">
      <div className="relative w-full max-w-lg">
        {/* Transfer visualization */}
        <div className="relative mb-8 h-24">
          {/* Source */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100">
                Received
              </span>
            </div>
          </div>

          {/* Destination */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div className="relative bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <FolderOpen className="w-10 h-10 text-primary" />
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="w-5 h-5 text-primary bg-white rounded-full" />
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full shadow-sm border border-primary/20">
                Saved
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute top-1/2 left-20 right-20 h-0.5 -translate-y-1/2 bg-gray-300">
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Google Drive folder */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-emerald-600 px-5 py-3 flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-white" />
            <div>
              <div className="text-white font-semibold text-sm">Google Drive</div>
              <div className="text-white/80 text-xs">Gettingdocs / 2024 / January</div>
            </div>
          </div>

          {/* Files */}
          <div className="p-4 space-y-2">
            {[
              { name: 'john_smith_jan.pdf', time: '2 mins ago' },
              { name: 'sarah_jones_jan.pdf', time: '5 mins ago' },
              { name: 'mike_wilson_jan.pdf', time: '8 mins ago' }
            ].map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors animate-[slideIn_0.5s_ease-out]"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-800 truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.time}</div>
                </div>
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              <span className="font-semibold">3 files</span> synced
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              Auto-sync on
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmyConvertsAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-10 shadow-lg min-h-[400px] flex items-center justify-center border border-gray-100">
      <div className="relative w-full max-w-2xl">
        {/* Conversion display */}
        <div className="flex items-center justify-between gap-8 mb-8">
          {/* PDF */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-32 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border-2 border-red-200 overflow-hidden">
                  <div className="absolute inset-0 p-3 space-y-1.5">
                    <div className="h-1.5 bg-red-200 rounded w-3/4"></div>
                    <div className="h-1.5 bg-red-200 rounded w-full"></div>
                    <div className="h-1.5 bg-red-200 rounded w-5/6"></div>
                    <div className="h-6 bg-red-300 rounded w-full mt-3"></div>
                    <div className="h-1.5 bg-red-200 rounded w-2/3"></div>
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-red-500 rounded p-1">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800">Bank Statement</div>
                  <div className="text-xs text-gray-500">PDF</div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow with processing */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="bg-primary rounded-full p-3 shadow-md">
                <Repeat className="w-6 h-6 text-white animate-[spin_3s_linear_infinite]" />
              </div>
            </div>
            <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Converting
            </div>
          </div>

          {/* CSV */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-primary/30 overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="flex h-6 bg-primary">
                      {['Date', 'Desc', '£'].map((h, i) => (
                        <div key={i} className="flex-1 border-r border-primary/30 flex items-center justify-center">
                          <span className="text-[7px] font-bold text-white">{h}</span>
                        </div>
                      ))}
                    </div>
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex h-5 border-b border-primary/10">
                        {[1, 2, 3].map((col) => (
                          <div key={col} className="flex-1 border-r border-primary/10 px-1 flex items-center">
                            <div className="h-1.5 bg-primary/20 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-primary rounded p-1">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800">Transactions</div>
                  <div className="text-xs text-gray-500">CSV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress info */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-800">48 transactions extracted</div>
            <div className="text-xs font-semibold text-primary">Ready for import</div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full animate-[progress_2s_ease-out]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YouNotifiedAnimation() {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-10 shadow-lg min-h-[400px] flex items-center justify-center border border-gray-100">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden border border-gray-100">
        {/* Dashboard header */}
        <div className="bg-gradient-to-r from-primary to-emerald-600 p-4">
          <div className="text-white font-semibold text-base">Gettingdocs Dashboard</div>
        </div>

        {/* Notification */}
        <div className="p-5">
          <div className="bg-primary/5 border-2 border-primary rounded-xl p-4 animate-[slideInDown_0.8s_ease-out]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1 text-sm">Document Received</div>
                <div className="text-xs text-gray-600">John Smith's January statement is ready</div>
              </div>
            </div>
          </div>

          {/* Activity list */}
          <div className="mt-5 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors animate-[fadeIn_0.5s_ease-out]"
                style={{ animationDelay: `${i * 0.2}s`, animationFillMode: 'both' }}
              >
                <CheckCircle className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-800">Client {i} responded</div>
                  <div className="text-xs text-gray-500">{i * 2}h ago</div>
                </div>
                <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Done</div>
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
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
            transform: translateY(-15px);
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
      `}</style>
    </div>
  );
}

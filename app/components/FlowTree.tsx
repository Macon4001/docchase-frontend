'use client';

import { Smartphone, Bot, FileSpreadsheet, Cloud } from 'lucide-react';
import { useEffect } from 'react';

export default function FlowTree() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.flow-node');
    nodes.forEach((node, idx) => {
      setTimeout(() => {
        node.classList.add('animate-in');
      }, idx * 150);
    });
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16">
      {/* Flow Container */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Node 1: Client */}
        <div className="flow-node flex flex-col items-center opacity-0 translate-y-4 transition-all duration-700">
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer">
              <Smartphone className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-sm" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              border: '2px solid rgba(59, 130, 246, 0.3)'
            }}>
              Client
            </div>
            <p className="text-xs text-gray-600 mt-2 max-w-[100px] hidden md:block">Sends documents</p>
          </div>
        </div>

        {/* Connector 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center">
            <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative overflow-hidden">
              {/* Flowing animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-[slideRight_2s_ease-in-out_infinite]"></div>
            </div>
            <div className="w-3 h-3 rounded-full bg-purple-500 -ml-1.5 animate-pulse shadow-lg"></div>
          </div>
          {/* Flowing blob */}
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-[flowBlob_3s_ease-in-out_infinite]"></div>
        </div>

        {/* Node 2: Amy AI */}
        <div className="flow-node flex flex-col items-center opacity-0 translate-y-4 transition-all duration-700">
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer">
              <Bot className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-sm" style={{
              background: 'rgba(168, 85, 247, 0.1)',
              color: '#a855f7',
              border: '2px solid rgba(168, 85, 247, 0.3)'
            }}>
              Amy AI
            </div>
            <p className="text-xs text-gray-600 mt-2 max-w-[100px] hidden md:block">Processes docs</p>
          </div>
        </div>

        {/* Connector 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center">
            <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-[slideRight_2s_ease-in-out_infinite_0.5s]"></div>
            </div>
            <div className="w-3 h-3 rounded-full bg-orange-500 -ml-1.5 animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-[flowBlob_3s_ease-in-out_infinite_1s]"></div>
        </div>

        {/* Node 3: Convert */}
        <div className="flow-node flex flex-col items-center opacity-0 translate-y-4 transition-all duration-700">
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer">
              <FileSpreadsheet className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-sm" style={{
              background: 'rgba(249, 115, 22, 0.1)',
              color: '#f97316',
              border: '2px solid rgba(249, 115, 22, 0.3)'
            }}>
              Convert
            </div>
            <p className="text-xs text-gray-600 mt-2 max-w-[100px] hidden md:block">PDF to CSV</p>
          </div>
        </div>

        {/* Connector 3 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center">
            <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-orange-500 to-green-500 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-[slideRight_2s_ease-in-out_infinite_1s]"></div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 -ml-1.5 animate-pulse shadow-lg" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-[flowBlob_3s_ease-in-out_infinite_2s]"></div>
        </div>

        {/* Node 4: Drive */}
        <div className="flow-node flex flex-col items-center opacity-0 translate-y-4 transition-all duration-700">
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer">
              <Cloud className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-sm" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              border: '2px solid rgba(16, 185, 129, 0.3)'
            }}>
              Drive
            </div>
            <p className="text-xs text-gray-600 mt-2 max-w-[100px] hidden md:block">Stored safely</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flow-node.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes flowBlob {
          0%, 100% {
            opacity: 0;
            transform: translateX(-20px);
          }
          50% {
            opacity: 1;
            transform: translateX(20px);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700']
});

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className={`text-xl font-bold ${playfair.className}`}>
                Gettingdocs
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

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
              <Link
                href="/privacy"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:underline transition-colors"
                style={{ color: '#4c5663' }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

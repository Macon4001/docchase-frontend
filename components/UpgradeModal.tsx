'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'client_limit' | 'chase_limit';
  currentCount?: number;
  limit?: number;
}

export function UpgradeModal({
  isOpen,
  onClose,
  reason = 'client_limit',
  currentCount,
  limit,
}: UpgradeModalProps) {
  const router = useRouter();

  const messages = {
    client_limit: {
      title: 'Client Limit Reached',
      description: `You've reached your limit of ${limit} client${limit !== 1 ? 's' : ''}. Upgrade to add more clients and automate your document chasing.`,
      action: 'add more clients',
    },
    chase_limit: {
      title: 'Chase Limit Reached',
      description: `You've used all ${currentCount || limit} of your free chases. To start new campaigns and continue chasing documents, please upgrade to a paid plan.`,
      action: 'start campaigns and send chases',
    },
  };

  const message = messages[reason];

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center border-2 border-yellow-300">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{message.title}</DialogTitle>
              {currentCount !== undefined && limit !== undefined && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentCount} / {limit} used
                </p>
              )}
            </div>
          </div>
          <DialogDescription className="text-base pt-3 text-gray-700">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        <div className="border-t border-b border-gray-200 py-4 my-4">
          <p className="text-sm text-gray-600 mb-3">
            <strong className="text-gray-900">Why upgrade?</strong> To {message.action}, you need a paid plan.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            Unlock with Upgrade:
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span><strong>Up to 50 clients</strong> - Scale your practice</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span><strong>Unlimited chases</strong> - No restrictions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span><strong>Automated reminders</strong> - Save time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span><strong>Google Drive integration</strong> - Seamless storage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span><strong>Bank statement conversion</strong> - PDF to Excel</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1">
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 order-1 sm:order-2 shadow-lg"
          >
            <Zap className="h-4 w-4 mr-2" />
            View Plans & Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

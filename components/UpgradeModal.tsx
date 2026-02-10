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
    },
    chase_limit: {
      title: 'Chase Limit Reached',
      description: `You've used all ${limit} of your free chases. Upgrade to get unlimited chases and manage more clients.`,
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
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <DialogTitle className="text-xl">{message.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <h4 className="font-semibold text-blue-900 mb-2">Upgrade Benefits:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>✓ Up to 50 clients</li>
            <li>✓ Unlimited chases</li>
            <li>✓ Auto-reminders</li>
            <li>✓ Google Drive integration</li>
            <li>✓ Bank statement conversion</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
          >
            View Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

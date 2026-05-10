'use client';

import { useState } from 'react';
import { Lock, Sparkles, ArrowRight, X } from 'lucide-react';

interface PaywallModalProps {
  toolName: string;
  toolDescription?: string;
  requiredTier?: 'full' | 'school';
  onClose?: () => void;
}

export function PaywallModal({
  toolName,
  toolDescription,
  requiredTier = 'full',
  onClose,
}: PaywallModalProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleClose = () => {
    setDismissed(true);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-wrife-text/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-wrife-muted hover:text-wrife-text transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-wrife-cream flex items-center justify-center">
            <Lock className="w-8 h-8 text-wrife-green" />
          </div>
        </div>

        {/* Copy */}
        <h2 className="text-2xl font-bold text-center text-wrife-text mb-2">
          Unlock {toolName}
        </h2>

        {toolDescription && (
          <p className="text-wrife-muted text-center text-sm mb-4">{toolDescription}</p>
        )}

        <p className="text-wrife-text text-center mb-6">
          This AI tool is part of the{' '}
          <strong className="text-wrife-green">Full Teacher</strong> plan.
          Upgrade to give your pupils real-time, individualised feedback on their writing.
        </p>

        {/* Value props */}
        <ul className="space-y-2 mb-8">
          {[
            'All 9 AI writing tools — unlimited',
            'Pupil-level feedback reports',
            'Works alongside any WriFe lesson',
            'Cancel anytime',
          ].map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm text-wrife-text">
              <Sparkles className="w-4 h-4 text-wrife-green flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="space-y-3">
          <a
            href="https://wrife.co.uk/pricing"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Choose a plan
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={handleClose}
            className="btn-secondary w-full text-center"
          >
            Maybe later
          </button>
        </div>

        <p className="text-center text-xs text-wrife-muted mt-4">
          Already subscribed?{' '}
          <a
            href="https://wrife.co.uk/login"
            className="text-wrife-green hover:underline"
          >
            Sign in to your account
          </a>
        </p>
      </div>
    </div>
  );
}

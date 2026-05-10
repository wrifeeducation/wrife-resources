import { Construction } from 'lucide-react';

export const metadata = { title: 'PWP Practice' };

/**
 * AI tool — built in Session 3 of the build plan.
 * Placeholder ensures the route exists and auth gate works.
 */
export default function PWPPage() {
  return (
    <div className="wrife-card max-w-2xl mx-auto text-center py-16">
      <Construction className="w-10 h-10 text-wrife-green mx-auto mb-4" />
      <h1 className="text-xl font-bold mb-2">PWP Practice</h1>
      <p className="text-wrife-muted text-sm">
        AI tool coming in Session 3. Auth and subscription gating are wired — this page is protected.
      </p>
    </div>
  );
}

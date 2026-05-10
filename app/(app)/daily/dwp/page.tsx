import { Construction } from 'lucide-react';

export const metadata = { title: 'Daily Writing Practice' };

export default function DWPPage() {
  return (
    <div className="wrife-card max-w-2xl mx-auto text-center py-16">
      <Construction className="w-10 h-10 text-wrife-green mx-auto mb-4" />
      <h1 className="text-xl font-bold mb-2">Daily Writing Practice</h1>
      <p className="text-wrife-muted text-sm">
        AI tool coming in Session 5 of the build plan.
      </p>
    </div>
  );
}

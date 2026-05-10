interface ScoreBadgeProps {
  score: number;     // 0–100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

function scoreColour(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (score >= 40) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5 font-semibold',
};

export function ScoreBadge({ score, label, size = 'md' }: ScoreBadgeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium
                  ${scoreColour(clamped)} ${sizes[size]}`}
    >
      <span>{clamped}%</span>
      {label && <span className="opacity-75">· {label}</span>}
    </span>
  );
}

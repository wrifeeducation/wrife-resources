import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type FeedbackVariant = 'success' | 'warning' | 'info' | 'error';

interface FeedbackCardProps {
  variant?: FeedbackVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<FeedbackVariant, {
  bg: string;
  border: string;
  icon: React.ElementType;
  iconColor: string;
}> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle2,
    iconColor: 'text-wrife-green',
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: AlertCircle,
    iconColor: 'text-wrife-orange',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-wrife-blue',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
};

export function FeedbackCard({
  variant = 'info',
  title,
  children,
  className = '',
}: FeedbackCardProps) {
  const { bg, border, icon: Icon, iconColor } = variantConfig[variant];

  return (
    <div
      className={`rounded-xl border p-4 ${bg} ${border} ${className}`}
      role="region"
      aria-label={title ?? 'Feedback'}
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-wrife-text mb-1 text-sm">{title}</p>
          )}
          <div className="text-sm text-wrife-text leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

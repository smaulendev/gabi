import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function StatCard({
  title,
  value,
  icon,
  variant = 'default',
}: Props) {
  const variants = {
    default: 'bg-white text-slate-900',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
  };

  return (
    <div className={`rounded-xl p-6 shadow-md transition hover:shadow-lg ${variants[variant]}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div>{icon}</div>
      </div>

      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
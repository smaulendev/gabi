import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-600 font-medium">
          {title}
        </h3>

        <div className="text-blue-600">
          {icon}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        {value}
      </h2>
    </div>
  );
}
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface Props {
  score: number;
  status: string;
  criticalAlerts: number;
  lowStockProducts: number;
  criticalSensors: number;
}

export default function HealthScoreGauge({
  score,
  status,
  criticalAlerts,
  lowStockProducts,
  criticalSensors,
}: Props) {
  const safeScore = Math.max(0, Math.min(100, score));

  const color =
    safeScore >= 80
      ? "text-emerald-500"
      : safeScore >= 60
      ? "text-orange-500"
      : "text-red-500";

  const ringColor =
    safeScore >= 80
      ? "from-emerald-400 to-green-500"
      : safeScore >= 60
      ? "from-yellow-400 to-orange-500"
      : "from-red-400 to-rose-600";

  const Icon =
    safeScore >= 80
      ? ShieldCheck
      : safeScore >= 60
      ? AlertTriangle
      : ShieldAlert;

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-950">
            Health Score
          </h2>

          <p className="text-sm text-slate-500">
            Estado general de la operación.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-slate-100">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${ringColor}`}
            style={{
              background: `conic-gradient(currentColor ${safeScore * 3.6}deg, #E5E7EB 0deg)`,
            }}
          />

          <div className="absolute inset-4 rounded-full bg-white shadow-inner" />

          <div className="relative z-10 text-center">
            <p className={`text-5xl font-extrabold ${color}`}>
              {safeScore}%
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500">
              {status}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-red-50 p-3 text-center">
          <p className="text-xs font-bold uppercase text-red-500">
            Alertas
          </p>
          <p className="mt-1 text-xl font-extrabold text-red-600">
            {criticalAlerts}
          </p>
        </div>

        <div className="rounded-2xl bg-orange-50 p-3 text-center">
          <p className="text-xs font-bold uppercase text-orange-500">
            Stock
          </p>
          <p className="mt-1 text-xl font-extrabold text-orange-600">
            {lowStockProducts}
          </p>
        </div>

        <div className="rounded-2xl bg-violet-50 p-3 text-center">
          <p className="text-xs font-bold uppercase text-violet-500">
            Sensores
          </p>
          <p className="mt-1 text-xl font-extrabold text-violet-600">
            {criticalSensors}
          </p>
        </div>
      </div>
    </div>
  );
}
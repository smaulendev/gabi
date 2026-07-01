import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Package,
  Boxes,
  Thermometer,
  ArrowRight,
} from "lucide-react";

interface Props {
  risk: string;
  healthScore: number;
  criticalAlerts: number;
  lowStockProducts: number;
  expiringSoonLots: number;
  criticalSensors: number;
  recommendation: string;
  fefoLot?: any;
  riskyProduct?: any;
}

export default function GabiIntelligenceCenter({
  risk,
  healthScore,
  criticalAlerts,
  lowStockProducts,
  expiringSoonLots,
  criticalSensors,
  recommendation,
  fefoLot,
  riskyProduct,
}: Props) {
  const normalizedRisk = String(risk || "").toUpperCase();

  const riskStyle =
    normalizedRisk === "ALTO"
      ? "bg-red-100 text-red-600"
      : normalizedRisk === "MEDIO"
      ? "bg-orange-100 text-orange-600"
      : "bg-emerald-100 text-emerald-600";

  const confidence = Math.max(72, Math.min(96, 100 - Math.floor(healthScore / 3)));

  const findings = [
    {
      label: `${criticalAlerts} alertas críticas activas`,
      icon: AlertTriangle,
      active: criticalAlerts > 0,
    },
    {
      label: `${lowStockProducts} productos bajo stock mínimo`,
      icon: Package,
      active: lowStockProducts > 0,
    },
    {
      label: `${expiringSoonLots} lotes próximos a vencer`,
      icon: Boxes,
      active: expiringSoonLots > 0,
    },
    {
      label: `${criticalSensors} sensores fuera de rango`,
      icon: Thermometer,
      active: criticalSensors > 0,
    },
  ];

  const actions = [
    fefoLot
      ? `Despachar primero el lote ${fefoLot.batchNumber}`
      : "Mantener priorización FEFO activa",
    riskyProduct
      ? `Revisar reposición de ${riskyProduct.name}`
      : "Verificar productos con menor cobertura",
    criticalSensors > 0
      ? "Revisar condiciones ambientales de bodega"
      : "Mantener monitoreo ambiental continuo",
  ];

  return (
    <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-violet-50/70 to-blue-50 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-lg shadow-violet-500/30">
            <Brain size={24} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              GABI Intelligence Center
            </h2>

            <p className="text-sm text-slate-500">
              Análisis automático para toma de decisiones.
            </p>
          </div>
        </div>

        <span className={`rounded-full px-4 py-2 text-xs font-extrabold ${riskStyle}`}>
          Riesgo {risk || "N/D"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
          <p className="text-xs font-bold uppercase text-slate-400">
            Confianza IA
          </p>

          <p className="mt-2 text-4xl font-extrabold text-slate-950">
            {confidence}%
          </p>

          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 lg:col-span-2">
          <p className="text-xs font-bold uppercase text-slate-400">
            Recomendación principal
          </p>

          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {recommendation}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-extrabold text-slate-900">
            Hallazgos detectados
          </p>

          <div className="space-y-3">
            {findings.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-2xl border p-3 ${
                    item.active
                      ? "border-red-100 bg-red-50 text-red-700"
                      : "border-emerald-100 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {item.active ? <Icon size={18} /> : <CheckCircle2 size={18} />}

                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-extrabold text-slate-900">
            Acciones sugeridas
          </p>

          <div className="space-y-3">
            {actions.map((action, index) => (
              <div
                key={action}
                className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/80 p-3 text-blue-800"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
                  {index + 1}
                </span>

                <span className="flex-1 text-sm font-semibold">{action}</span>

                <ArrowRight size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
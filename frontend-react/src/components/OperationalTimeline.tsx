import {
  AlertTriangle,
  Boxes,
  Brain,
  Package,
  Thermometer,
  CheckCircle2,
} from "lucide-react";

interface TimelineEvent {
  id: string | number;
  type: "alert" | "fefo" | "stock" | "sensor" | "ai" | "ok";
  title: string;
  description: string;
  time?: string;
  severity?: "critical" | "warning" | "info" | "success";
}

interface Props {
  events: TimelineEvent[];
}

export default function OperationalTimeline({ events }: Props) {
  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "alert":
        return AlertTriangle;
      case "fefo":
        return Boxes;
      case "stock":
        return Package;
      case "sensor":
        return Thermometer;
      case "ai":
        return Brain;
      default:
        return CheckCircle2;
    }
  };

  const getStyle = (severity?: TimelineEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          icon: "bg-red-100 text-red-600",
          border: "border-red-100",
          dot: "bg-red-500",
        };
      case "warning":
        return {
          icon: "bg-orange-100 text-orange-600",
          border: "border-orange-100",
          dot: "bg-orange-500",
        };
      case "success":
        return {
          icon: "bg-emerald-100 text-emerald-600",
          border: "border-emerald-100",
          dot: "bg-emerald-500",
        };
      default:
        return {
          icon: "bg-blue-100 text-blue-600",
          border: "border-blue-100",
          dot: "bg-blue-500",
        };
    }
  };

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Timeline operacional
            </h2>

            <p className="text-sm text-slate-500">
              Secuencia de eventos relevantes del sistema.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          No existen eventos operacionales críticos. La operación se mantiene estable.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Brain size={20} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-950">
            Timeline operacional
          </h2>

          <p className="text-sm text-slate-500">
            Secuencia de eventos relevantes para la toma de decisiones.
          </p>
        </div>
      </div>

      <div className="relative space-y-4">
        <div className="absolute left-5 top-2 h-[calc(100%-16px)] w-px bg-slate-200" />

        {events.slice(0, 8).map((event) => {
          const Icon = getIcon(event.type);
          const style = getStyle(event.severity);

          return (
            <div
              key={event.id}
              className="relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="relative z-10">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${style.icon}`}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <h3 className="font-extrabold text-slate-900">
                    {event.title}
                  </h3>

                  {event.time && (
                    <span className="text-xs font-bold text-slate-400">
                      {event.time}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import StatCard from "../components/StatCard";
import EnvironmentChart from "../components/EnvironmentChart";

import {
  Package,
  Boxes,
  AlertTriangle,
  Thermometer,
  Brain,
  Activity,
  Bell,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [aiRisk, setAiRisk] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [productsRes, lotsRes, alertsRes, sensorsRes] = await Promise.all([
        api.get("/products"),
        api.get("/lots"),
        api.get("/alerts/active"),
        api.get("/sensor-readings/latest"),
      ]);

      setProducts(productsRes.data);
      setLots(lotsRes.data);
      setAlerts(alertsRes.data);
      setSensors(sensorsRes.data);

      try {
        const aiRes = await api.get("/ai/risk-summary");
        setAiRisk(aiRes.data.aiResponse);
      } catch (error) {
        console.error("Error cargando IA:", error);
        setAiRisk(null);
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  const latestSensor = sensors[0];

  const getSeverityStyle = (severity: string) => {
    const value = String(severity || "").toUpperCase();

    if (value === "HIGH" || value === "ALTO" || value === "CRITICAL") {
      return "bg-red-100 text-red-600";
    }

    if (value === "MEDIUM" || value === "MEDIO") {
      return "bg-orange-100 text-orange-600";
    }

    return "bg-emerald-100 text-emerald-600";
  };

  const getSensorStatusStyle = (status: string) => {
    const value = String(status || "").toUpperCase();

    if (value === "CRITICAL" || value === "CRÍTICO") {
      return "bg-red-100 text-red-600";
    }

    return "bg-emerald-100 text-emerald-600";
  };

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/30">
                <Activity size={26} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
                  Dashboard GABI
                </h1>

                <p className="mt-1 text-slate-500">
                  Centro de monitoreo logístico inteligente.
                </p>
              </div>
            </div>
          </div>
          <div />
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Productos"
            value={products.length}
            icon={<Package size={28} />}
          />

          <StatCard
            title="Lotes"
            value={lots.length}
            icon={<Boxes size={28} />}
          />

          <StatCard
            title="Alertas"
            value={alerts.length}
            icon={<AlertTriangle size={28} />}
          />

          <StatCard
            title="Temperatura"
            value={latestSensor ? `${latestSensor.temperature}°C` : "-"}
            icon={<Thermometer size={28} />}
          />

          <StatCard
            title="Riesgo IA"
            value={aiRisk?.risk || "-"}
            icon={<Brain size={28} />}
            variant={
              aiRisk?.risk === "ALTO"
                ? "danger"
                : aiRisk?.risk === "MEDIO"
                ? "warning"
                : aiRisk?.risk === "BAJO"
                ? "success"
                : "default"
            }
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Últimas alertas activas
                </h2>

                <p className="text-sm text-slate-500">
                  Eventos relevantes detectados por el sistema.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-800">
                      {alert.type}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${getSeverityStyle(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {alert.message}
                  </p>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  No existen alertas activas.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Thermometer size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Últimas lecturas ambientales
                </h2>

                <p className="text-sm text-slate-500">
                  Temperatura y humedad de las bodegas monitoreadas.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sensors.slice(0, 5).map((sensor) => (
                <div
                  key={sensor.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {sensor.location || "Bodega"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Temp: {sensor.temperature}°C · Humedad:{" "}
                      {sensor.humidity}%
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${getSensorStatusStyle(
                      sensor.status
                    )}`}
                  >
                    {sensor.status}
                  </span>
                </div>
              ))}

              {sensors.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  No existen lecturas registradas.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                Tendencia ambiental
              </h2>

              <p className="text-sm text-slate-500">
                Últimas lecturas de temperatura y humedad.
              </p>
            </div>
          </div>

          <EnvironmentChart data={sensors} />
        </section>
      </div>
    </Layout>
  );
}
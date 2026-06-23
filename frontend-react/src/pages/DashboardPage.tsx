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
    const [productsRes, lotsRes, alertsRes, sensorsRes] =
      await Promise.all([
        api.get('/products'),
        api.get('/lots'),
        api.get('/alerts/active'),
        api.get('/sensor-readings/latest'),
      ]);

    setProducts(productsRes.data);
    setLots(lotsRes.data);
    setAlerts(alertsRes.data);
    setSensors(sensorsRes.data);

    try {
      const aiRes = await api.get('/ai/risk-summary');
      setAiRisk(aiRes.data.aiResponse);
    } catch (error) {
      console.error('Error cargando IA:', error);
      setAiRisk(null);
    }
  } catch (error) {
    console.error('Error cargando dashboard:', error);
  }
};
  const latestSensor = sensors[0];

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard GABI</h1>

        <p className="mt-2 text-slate-500">
          Centro de monitoreo logístico inteligente.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
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
          />{" "}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-slate-900">
              Últimas alertas activas
            </h2>

            <div className="mt-4 space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {alert.type}
                    </span>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      {alert.severity}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">{alert.message}</p>
                </div>
              ))}

              {alerts.length === 0 && (
                <p className="text-slate-500">No existen alertas activas.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-slate-900">
              Últimas lecturas ambientales
            </h2>

            <div className="mt-4 space-y-4">
              {sensors.slice(0, 5).map((sensor) => (
                <div
                  key={sensor.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {sensor.location || "Bodega"}
                    </p>

                    <p className="text-sm text-slate-500">
                      Temp: {sensor.temperature}°C · Humedad: {sensor.humidity}%
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      sensor.status === "CRITICAL"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {sensor.status}
                  </span>
                </div>
              ))}

              {sensors.length === 0 && (
                <p className="text-slate-500">
                  No existen lecturas registradas.
                </p>
              )}
            </div>
          </section>
        </div>

        <EnvironmentChart data={sensors} />
      </div>
    </Layout>
  );
}

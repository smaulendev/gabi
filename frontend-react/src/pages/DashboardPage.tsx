import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import StatCard from "../components/StatCard";
import EnvironmentChart from "../components/EnvironmentChart";
import StockByProductChart from "../components/StockByProductChart";
import AlertsSeverityChart from "../components/AlertsSeverityChart";
import HealthScoreGauge from "../components/HealthScoreGauge";
import GabiIntelligenceCenter from "../components/GabiIntelligenceCenter";
import OperationalTimeline from "../components/OperationalTimeline";

import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  Brain,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  ShieldAlert,
  Thermometer,
  Warehouse,
  Zap,
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
      } catch {
        setAiRisk(null);
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  const kpis = useMemo(() => {
    const today = new Date();

    const getDaysToExpire = (expirationDate: string) => {
      const expiration = new Date(expirationDate);
      const diff = expiration.getTime() - today.getTime();

      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const totalStock = lots.reduce(
      (acc, lot) => acc + Number(lot.currentQuantity || 0),
      0
    );

    const initialStock = lots.reduce(
      (acc, lot) => acc + Number(lot.quantity || 0),
      0
    );

    const consumedStock = Math.max(0, initialStock - totalStock);

    const depletedLots = lots.filter(
      (lot) => Number(lot.currentQuantity || 0) === 0
    );

    const expiredLots = lots.filter(
      (lot) => getDaysToExpire(lot.expirationDate) < 0
    );

    const expiringSoonLots = lots.filter((lot) => {
      const days = getDaysToExpire(lot.expirationDate);
      return days >= 0 && days <= 30 && Number(lot.currentQuantity || 0) > 0;
    });

    const criticalAlerts = alerts.filter((alert) => {
      const severity = String(alert.severity || "").toUpperCase();
      return severity === "HIGH" || severity === "CRITICAL" || severity === "ALTO";
    });

    const mediumAlerts = alerts.filter((alert) => {
      const severity = String(alert.severity || "").toUpperCase();
      return severity === "MEDIUM" || severity === "MEDIO";
    });

    const lowAlerts = alerts.filter((alert) => {
      const severity = String(alert.severity || "").toUpperCase();
      return severity === "LOW" || severity === "BAJO";
    });

    const criticalSensors = sensors.filter((sensor) => {
      const status = String(sensor.status || "").toUpperCase();
      return status === "CRITICAL" || status === "CRÍTICO";
    });

    const averageTemperature =
      sensors.length > 0
        ? sensors.reduce(
            (acc, sensor) => acc + Number(sensor.temperature || 0),
            0
          ) / sensors.length
        : 0;

    const averageHumidity =
      sensors.length > 0
        ? sensors.reduce(
            (acc, sensor) => acc + Number(sensor.humidity || 0),
            0
          ) / sensors.length
        : 0;

    const coldChainProducts = products.filter(
      (product) => product.requiresColdChain
    );

    const stockByProduct = products.map((product) => {
      const productLots = lots.filter((lot) => lot.product?.id === product.id);

      const currentStock = productLots.reduce(
        (acc, lot) => acc + Number(lot.currentQuantity || 0),
        0
      );

      const initialProductStock = productLots.reduce(
        (acc, lot) => acc + Number(lot.quantity || 0),
        0
      );

      const minStock = Number(product.minStock ?? 10);

      const productExpiringLots = productLots.filter((lot) => {
        const days = getDaysToExpire(lot.expirationDate);
        return days >= 0 && days <= 30 && Number(lot.currentQuantity || 0) > 0;
      });

      const productExpiredLots = productLots.filter(
        (lot) => getDaysToExpire(lot.expirationDate) < 0
      );

      const usage =
        initialProductStock > 0
          ? Math.round(
              ((initialProductStock - currentStock) / initialProductStock) * 100
            )
          : 0;

      let riskScore = 0;

      if (currentStock === 0) riskScore += 40;
      if (currentStock < minStock) riskScore += 25;
      riskScore += productExpiringLots.length * 12;
      riskScore += productExpiredLots.length * 20;
      if (product.requiresColdChain) riskScore += 8;

      riskScore = Math.min(100, riskScore);

      return {
        ...product,
        currentStock,
        initialProductStock,
        minStock,
        gap: Math.max(0, minStock - currentStock),
        isLowStock: currentStock < minStock,
        expiringLots: productExpiringLots.length,
        expiredLots: productExpiredLots.length,
        usage,
        riskScore,
      };
    });

    const lowStockProducts = stockByProduct.filter((item) => item.isLowStock);

    const riskyProducts = [...stockByProduct]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    const stockUsage =
      initialStock > 0 ? Math.round((consumedStock / initialStock) * 100) : 0;

    const fefoCompliance =
      lots.length > 0
        ? Math.round(
            ((lots.length - expiredLots.length - depletedLots.length) /
              lots.length) *
              100
          )
        : 100;

    let healthScore = 100;

    healthScore -= criticalAlerts.length * 12;
    healthScore -= mediumAlerts.length * 5;
    healthScore -= expiredLots.length * 10;
    healthScore -= expiringSoonLots.length * 6;
    healthScore -= depletedLots.length * 8;
    healthScore -= lowStockProducts.length * 7;
    healthScore -= criticalSensors.length * 10;

    healthScore = Math.max(0, Math.min(100, healthScore));

    const operationalStatus =
      healthScore >= 80
        ? "Operación estable"
        : healthScore >= 60
        ? "Requiere atención"
        : "Riesgo crítico";

const operationalVariant: "success" | "warning" | "danger" =
  healthScore >= 80 ? "success" : healthScore >= 60 ? "warning" : "danger";

    const aiRecommendation =
      healthScore >= 80
        ? "La operación se mantiene estable. Mantener monitoreo FEFO, revisar vencimientos próximos y conservar parámetros ambientales."
        : healthScore >= 60
        ? "Priorizar productos bajo stock mínimo, lotes próximos a vencer y alertas activas antes de nuevos despachos."
        : "Atención inmediata: existen riesgos críticos en stock, vencimientos o condiciones ambientales.";

    const fefoPriority = lots
      .map((lot) => ({
        ...lot,
        daysToExpire: getDaysToExpire(lot.expirationDate),
      }))
      .filter((lot) => Number(lot.currentQuantity || 0) > 0)
      .sort((a, b) => a.daysToExpire - b.daysToExpire)
      .slice(0, 5);

    const timelineEvents = [
      ...criticalAlerts.slice(0, 2).map((alert, index) => ({
        id: `alert-${alert.id || index}`,
        type: "alert" as const,
        title: "Alerta crítica detectada",
        description: alert.message || "Existe una alerta crítica activa.",
        severity: "critical" as const,
        time: "Ahora",
      })),

      ...expiringSoonLots.slice(0, 2).map((lot, index) => ({
        id: `fefo-${lot.id || index}`,
        type: "fefo" as const,
        title: "Lote próximo a vencer",
        description: `${lot.batchNumber} vence en ${getDaysToExpire(
          lot.expirationDate
        )} días. Priorizar despacho FEFO.`,
        severity: "warning" as const,
        time: "FEFO",
      })),

      ...lowStockProducts.slice(0, 2).map((product, index) => ({
        id: `stock-${product.id || index}`,
        type: "stock" as const,
        title: "Producto bajo stock mínimo",
        description: `${product.name} tiene stock ${product.currentStock}, bajo el mínimo definido (${product.minStock}).`,
        severity: "warning" as const,
        time: "Stock",
      })),

      ...criticalSensors.slice(0, 2).map((sensor, index) => ({
        id: `sensor-${sensor.id || index}`,
        type: "sensor" as const,
        title: "Sensor fuera de rango",
        description: `${sensor.location || "Bodega"} registra ${
          sensor.temperature
        }°C y ${sensor.humidity}% de humedad.`,
        severity: "critical" as const,
        time: "Sensor",
      })),

      {
        id: "ai-recommendation",
        type: "ai" as const,
        title: "Recomendación IA generada",
        description: aiRecommendation,
        severity:
          healthScore >= 80
            ? ("success" as const)
            : healthScore >= 60
            ? ("warning" as const)
            : ("critical" as const),
        time: "IA",
      },
    ];

    return {
      totalStock,
      initialStock,
      consumedStock,
      depletedLots,
      expiredLots,
      expiringSoonLots,
      criticalAlerts,
      mediumAlerts,
      lowAlerts,
      criticalSensors,
      averageTemperature,
      averageHumidity,
      coldChainProducts,
      lowStockProducts,
      stockByProduct,
      riskyProducts,
      stockUsage,
      fefoCompliance,
      healthScore,
      operationalStatus,
      operationalVariant,
      aiRecommendation,
      fefoPriority,
      timelineEvents,
    };
  }, [products, lots, alerts, sensors]);

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

  const getFefoBadge = (days: number) => {
    if (days < 0) return "bg-red-100 text-red-600";
    if (days <= 15) return "bg-orange-100 text-orange-600";
    if (days <= 30) return "bg-yellow-100 text-yellow-700";

    return "bg-emerald-100 text-emerald-600";
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return "bg-red-100 text-red-600";
    if (score >= 40) return "bg-orange-100 text-orange-600";
    if (score >= 20) return "bg-yellow-100 text-yellow-700";

    return "bg-emerald-100 text-emerald-600";
  };

  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/30">
              <Activity size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Dashboard Ejecutivo GABI
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Panel de decisión para inventario, FEFO, alertas, sensores e IA.
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Salud operacional"
            value={`${kpis.healthScore}%`}
            icon={<ShieldAlert size={28} />}
           variant={kpis.operationalVariant as "success" | "warning" | "danger"}
          />

          <StatCard
            title="Cumplimiento FEFO"
            value={`${kpis.fefoCompliance}%`}
            icon={<ClipboardCheck size={28} />}
            variant={kpis.fefoCompliance >= 85 ? "success" : "warning"}
          />

          <StatCard
            title="Stock disponible"
            value={kpis.totalStock}
            icon={<Warehouse size={28} />}
          />

          <StatCard
            title="Próx. vencer"
            value={kpis.expiringSoonLots.length}
            icon={<CalendarClock size={28} />}
            variant={kpis.expiringSoonLots.length > 0 ? "warning" : "success"}
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

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <HealthScoreGauge
            score={kpis.healthScore}
            status={kpis.operationalStatus}
            criticalAlerts={kpis.criticalAlerts.length}
            lowStockProducts={kpis.lowStockProducts.length}
            criticalSensors={kpis.criticalSensors.length}
          />

          <div className="xl:col-span-3">
            <GabiIntelligenceCenter
              risk={aiRisk?.risk || "ALTO"}
              healthScore={kpis.healthScore}
              criticalAlerts={kpis.criticalAlerts.length}
              lowStockProducts={kpis.lowStockProducts.length}
              expiringSoonLots={kpis.expiringSoonLots.length}
              criticalSensors={kpis.criticalSensors.length}
              recommendation={kpis.aiRecommendation}
              fefoLot={kpis.fefoPriority[0]}
              riskyProduct={kpis.riskyProducts[0]}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <OperationalTimeline events={kpis.timelineEvents} />
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Gauge size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Alertas por severidad
                </h2>

                <p className="text-sm text-slate-500">
                  Priorización de eventos activos.
                </p>
              </div>
            </div>

            <div className="h-[280px] w-full min-w-0">
              <AlertsSeverityChart
                critical={kpis.criticalAlerts.length}
                medium={kpis.mediumAlerts.length}
                low={kpis.lowAlerts.length}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <BarChart3 size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Stock por producto
                </h2>

                <p className="text-sm text-slate-500">
                  Comparación entre stock actual y stock mínimo.
                </p>
              </div>
            </div>

            <div className="mt-6 h-[320px] w-full min-w-0">
              <StockByProductChart data={kpis.stockByProduct} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Zap size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Ranking de productos críticos
                </h2>

                <p className="text-sm text-slate-500">
                  Riesgo calculado por stock, vencimiento y criticidad.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {kpis.riskyProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-800">
                        {product.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Stock: {product.currentStock} · Mínimo:{" "}
                        {product.minStock} · Próx. vencer:{" "}
                        {product.expiringLots}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getRiskBadge(
                        product.riskScore
                      )}`}
                    >
                      {product.riskScore}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                      style={{ width: `${product.riskScore}%` }}
                    />
                  </div>
                </div>
              ))}

              {kpis.riskyProducts.length === 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  No existen productos críticos registrados.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Boxes size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Matriz FEFO prioritaria
                </h2>

                <p className="text-sm text-slate-500">
                  Lotes que deben despacharse primero.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {kpis.fefoPriority.map((lot) => (
                <div
                  key={lot.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {lot.batchNumber}
                    </p>

                    <p className="text-sm text-slate-500">
                      {lot.product?.name || "Producto sin nombre"} · Stock:{" "}
                      {lot.currentQuantity}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getFefoBadge(
                      lot.daysToExpire
                    )}`}
                  >
                    {lot.daysToExpire < 0
                      ? "Vencido"
                      : `${lot.daysToExpire} días`}
                  </span>
                </div>
              ))}

              {kpis.fefoPriority.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  No existen lotes disponibles para priorización FEFO.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Control de inventario
                </h2>

                <p className="text-sm text-slate-500">
                  Estado general del stock y consumo.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-semibold text-slate-600">
                  Stock inicial
                </span>

                <span className="font-extrabold text-slate-900">
                  {kpis.initialStock}
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-semibold text-slate-600">
                  Stock consumido
                </span>

                <span className="font-extrabold text-slate-900">
                  {kpis.consumedStock}
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-red-50 p-4">
                <span className="font-semibold text-red-700">
                  Lotes agotados
                </span>

                <span className="font-extrabold text-red-700">
                  {kpis.depletedLots.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Thermometer size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Ambiente
                </h2>

                <p className="text-sm text-slate-500">
                  Condiciones promedio.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-semibold text-slate-600">
                  Temp. promedio
                </span>

                <span className="font-extrabold text-slate-900">
                  {kpis.averageTemperature.toFixed(1)}°C
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-slate-50 p-4">
                <span className="font-semibold text-slate-600">
                  Humedad promedio
                </span>

                <span className="font-extrabold text-slate-900">
                  {kpis.averageHumidity.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-red-50 p-4">
                <span className="font-semibold text-red-700">
                  Sensores críticos
                </span>

                <span className="font-extrabold text-red-700">
                  {kpis.criticalSensors.length}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md xl:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Activity size={20} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Tendencia ambiental
                </h2>

                <p className="text-sm text-slate-500">
                  Lecturas recientes de temperatura y humedad.
                </p>
              </div>
            </div>

            <div className="mt-6 h-[280px] w-full min-w-0 sm:h-[320px] lg:h-[360px]">
              <EnvironmentChart data={sensors} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
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
                className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm"
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
        </section>
      </div>
    </Layout>
  );
}
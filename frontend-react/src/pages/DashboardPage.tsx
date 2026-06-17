import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';
import StatCard from '../components/StatCard';

import {
  Package,
  Boxes,
  AlertTriangle,
  Thermometer,
  Brain,
} from 'lucide-react';

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
      const [productsRes, lotsRes, alertsRes, sensorsRes, aiRes] =
        await Promise.all([
          api.get('/products'),
          api.get('/lots'),
          api.get('/alerts/active'),
          api.get('/sensor-readings/latest'),
          api.get('/ai/risk-summary'),
        ]);

      setProducts(productsRes.data);
      setLots(lotsRes.data);
      setAlerts(alertsRes.data);
      setSensors(sensorsRes.data);
      setAiRisk(aiRes.data.aiResponse);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  };

  const latestSensor = sensors[0];

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard GABI
        </h1>

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
            value={latestSensor ? `${latestSensor.temperature}°C` : '-'}
            icon={<Thermometer size={28} />}
          />

          <StatCard
            title="Riesgo IA"
            value={aiRisk?.risk || '-'}
            icon={<Brain size={28} />}
          />
        </div>
      </div>
    </Layout>
  );
}
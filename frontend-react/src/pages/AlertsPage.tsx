import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';
import { toast } from 'react-toastify';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const res = await api.get('/alerts');
    setAlerts(res.data);
  };

const resolveAlert = async (id: number) => {
  try {
    await api.patch(`/alerts/${id}/resolve`);

    toast.success('Alerta resuelta correctamente');

    loadAlerts();
  } catch {
    toast.error('No fue posible resolver la alerta');
  }
};

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">Alertas</h1>

      <p className="mt-2 text-slate-500">
        Gestión de alertas operacionales e inteligentes.
      </p>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-slate-900">
          Alertas registradas
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Severidad</th>
                <th className="px-4 py-3">Mensaje</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acción</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {alert.type}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        alert.severity === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {alert.message}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        alert.isResolved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {alert.isResolved ? 'Resuelta' : 'Activa'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {!alert.isResolved ? (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Resolver
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Sin acción
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {alerts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No existen alertas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
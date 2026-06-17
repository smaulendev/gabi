import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';
import EnvironmentChart from '../components/EnvironmentChart';

export default function SensorsPage() {
  const [sensors, setSensors] = useState<any[]>([]);

  const [form, setForm] = useState({
    temperature: 5,
    humidity: 55,
    location: 'Bodega Central',
  });

  useEffect(() => {
    loadSensors();
  }, []);

  const loadSensors = async () => {
    const res = await api.get('/sensor-readings');
    setSensors(res.data);
  };

  const createReading = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post('/sensor-readings', {
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      location: form.location,
    });

    loadSensors();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">
        Sensores simulados
      </h1>

      <p className="mt-2 text-slate-500">
        Registro y monitoreo de condiciones ambientales.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">
            Registrar lectura
          </h2>

          <form onSubmit={createReading} className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Ubicación"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Temperatura"
              value={form.temperature}
              onChange={(e) =>
                setForm({
                  ...form,
                  temperature: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Humedad"
              value={form.humidity}
              onChange={(e) =>
                setForm({
                  ...form,
                  humidity: Number(e.target.value),
                })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    location: 'Bodega Central',
                    temperature: 5,
                    humidity: 55,
                  })
                }
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Normal
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    location: 'Bodega Central',
                    temperature: 30,
                    humidity: 80,
                  })
                }
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Crítica
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Guardar lectura
            </button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">
            Historial ambiental
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600">
                  <th className="px-4 py-3">Ubicación</th>
                  <th className="px-4 py-3">Temperatura</th>
                  <th className="px-4 py-3">Humedad</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {sensors.map((sensor) => (
                  <tr key={sensor.id} className="border-b">
                    <td className="px-4 py-3 font-medium">
                      {sensor.location || 'Bodega'}
                    </td>

                    <td className="px-4 py-3">
                      {sensor.temperature}°C
                    </td>

                    <td className="px-4 py-3">
                      {sensor.humidity}%
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          sensor.status === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {sensor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <EnvironmentChart data={sensors.slice(0, 8)} />
    </Layout>
  );
}
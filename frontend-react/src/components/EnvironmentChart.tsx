import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Props {
  data: any[];
}

export default function EnvironmentChart({ data }: Props) {
  const chartData = [...data]
    .reverse()
    .map((item) => ({
      name: `#${item.id}`,
      temperatura: item.temperature,
      humedad: item.humidity,
    }));

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-slate-900">
        Tendencia ambiental
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Últimas lecturas de temperatura y humedad.
      </p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#2563eb"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="humedad"
              stroke="#dc2626"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
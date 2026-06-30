import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  data: any[];
}

export default function EnvironmentChart({ data }: Props) {
  const chartData = [...data]
    .reverse()
    .map((item) => ({
      name: `#${item.id}`,
      temperatura: Number(item.temperature),
      humedad: Number(item.humidity),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.temperatura) &&
        Number.isFinite(item.humedad)
    );

  if (chartData.length === 0) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 text-sm font-semibold text-slate-500">
        No existen datos ambientales suficientes para graficar.
      </div>
    );
  }

  return (
    <div className="h-full min-h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 24,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
            }}
          />

          <Legend verticalAlign="top" align="right" height={36} />

          <Line
            type="monotone"
            dataKey="temperatura"
            name="Temperatura (°C)"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="humedad"
            name="Humedad (%)"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  critical: number;
  medium: number;
  low: number;
}

export default function AlertsSeverityChart({ critical, medium, low }: Props) {
  const data = [
    { name: "Críticas", value: critical, color: "#EF4444" },
    { name: "Medias", value: medium, color: "#F97316" },
    { name: "Bajas", value: low, color: "#22C55E" },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 text-sm font-semibold text-slate-500">
        No existen alertas activas para graficar.
      </div>
    );
  }

  return (
    <div className="h-full min-h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
}

export default function StockByProductChart({ data }: Props) {
  const chartData = data
    .map((product) => ({
      name: product.name,
      stock: Number(product.currentStock || 0),
      minimo: Number(product.minStock || 0),
    }))
    .slice(0, 8);

  if (chartData.length === 0) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 text-sm font-semibold text-slate-500">
        No existen datos de stock para graficar.
      </div>
    );
  }

  return (
    <div className="h-full min-h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748B" }}
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

          <Bar dataKey="stock" name="Stock actual" fill="#3B82F6" radius={[10, 10, 0, 0]} />
          <Bar dataKey="minimo" name="Stock mínimo" fill="#A855F7" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
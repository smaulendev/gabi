import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    const response = await api.get("/audit");
    setLogs(response.data);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">Auditoría</h1>

      <p className="mt-2 text-slate-500">
        Registro inmutable de acciones críticas con hash SHA-256.
      </p>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-slate-900">
          Logs de auditoría
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Entidad</th>
                <th className="px-4 py-3">Detalle</th>
                <th className="px-4 py-3">Hash</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="px-4 py-3 font-semibold">
                    {log.action}
                  </td>

                  <td className="px-4 py-3">{log.entity}</td>

                  <td className="px-4 py-3">{log.details}</td>

                  <td className="max-w-[240px] truncate px-4 py-3 font-mono text-xs text-slate-600">
                    {log.hash}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No existen registros de auditoría.
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
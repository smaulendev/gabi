import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';

export default function InventoryMovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      const response = await api.get('/inventory/movements');
      setMovements(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">
        Movimientos FEFO
      </h1>

      <p className="mt-2 text-slate-500">
        Historial completo de despachos y movimientos de inventario.
      </p>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Lote</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Detalle</th>
              <th className="px-4 py-3">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-b">
                <td className="px-4 py-3">{movement.id}</td>

                <td className="px-4 py-3">
                  #{movement.productId}
                </td>

                <td className="px-4 py-3">
                  #{movement.lotId}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {movement.quantity}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {movement.type}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {movement.detail}
                </td>

                <td className="px-4 py-3">
                  {new Date(
                    movement.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
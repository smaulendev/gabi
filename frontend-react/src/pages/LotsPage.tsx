import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';

export default function LotsPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    batchNumber: '',
    expirationDate: '',
    quantity: 0,
    currentQuantity: 0,
    productId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [lotsRes, productsRes] = await Promise.all([
      api.get('/lots'),
      api.get('/products'),
    ]);

    setLots(lotsRes.data);
    setProducts(productsRes.data);
  };

  const createLot = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post('/lots', {
      batchNumber: form.batchNumber,
      expirationDate: form.expirationDate,
      quantity: Number(form.quantity),
      currentQuantity: Number(form.currentQuantity),
      productId: Number(form.productId),
    });

    setForm({
      batchNumber: '',
      expirationDate: '',
      quantity: 0,
      currentQuantity: 0,
      productId: '',
    });

    loadData();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">
        Lotes FEFO
      </h1>

      <p className="mt-2 text-slate-500">
        Gestión de lotes, vencimientos y stock disponible.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">
            Crear lote
          </h2>

          <form onSubmit={createLot} className="mt-6 space-y-4">
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={form.productId}
              onChange={(e) =>
                setForm({ ...form, productId: e.target.value })
              }
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} - {product.name}
                </option>
              ))}
            </select>

            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Número de lote"
              value={form.batchNumber}
              onChange={(e) =>
                setForm({ ...form, batchNumber: e.target.value })
              }
              required
            />

            <input
              type="date"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={form.expirationDate}
              onChange={(e) =>
                setForm({ ...form, expirationDate: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Cantidad inicial"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: Number(e.target.value),
                  currentQuantity: Number(e.target.value),
                })
              }
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Guardar lote
            </button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">
            Lotes registrados
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600">
                  <th className="px-4 py-3">Lote</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Vencimiento</th>
                  <th className="px-4 py-3">Stock inicial</th>
                  <th className="px-4 py-3">Stock actual</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id} className="border-b">
                    <td className="px-4 py-3 font-medium">
                      {lot.batchNumber}
                    </td>

                    <td className="px-4 py-3">
                      {lot.product?.name || '-'}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(lot.expirationDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      {lot.quantity}
                    </td>

                    <td className="px-4 py-3">
                      {lot.currentQuantity}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          lot.currentQuantity === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {lot.currentQuantity === 0
                          ? 'Agotado'
                          : 'Disponible'}
                      </span>
                    </td>
                  </tr>
                ))}

                {lots.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No existen lotes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
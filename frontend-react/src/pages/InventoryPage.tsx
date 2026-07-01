import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api/api';
import { toast } from 'react-toastify';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);

  const [form, setForm] = useState({
    productId: '',
    quantity: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsRes, lotsRes, movementsRes] = await Promise.all([
      api.get('/products'),
      api.get('/lots'),
      api.get('/inventory/movements'),
    ]);

    setProducts(productsRes.data);
    setLots(lotsRes.data);
    setMovements(movementsRes.data);
  };

const dispatchInventory = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await api.post('/inventory/dispatch', {
      productId: Number(form.productId),
      quantity: Number(form.quantity),
    });

    toast.success('Despacho FEFO realizado correctamente');

    setForm({
      productId: '',
      quantity: 0,
    });

    loadData();
  } catch {
    toast.error('Stock insuficiente o datos inválidos para el despacho');
  }
};

  const getTotalStockByProduct = (productId: number) => {
    return lots
      .filter((lot) => lot.product?.id === productId)
      .reduce((sum, lot) => sum + lot.currentQuantity, 0);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">
        Inventario FEFO
      </h1>

      <p className="mt-2 text-slate-500">
        Control de stock, despachos FEFO y trazabilidad de movimientos.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">
            Realizar despacho
          </h2>

          <form onSubmit={dispatchInventory} className="mt-6 space-y-4">
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
              type="number"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Cantidad a despachar"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: Number(e.target.value),
                })
              }
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Despachar con FEFO
            </button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">
            Stock por producto
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600">
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Stock total</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const stock = getTotalStockByProduct(product.id);

                  return (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3 font-semibold">
                        {product.sku}
                      </td>

                      <td className="px-4 py-3">
                        {product.name}
                      </td>

                      <td className="px-4 py-3">
                        {product.category || '-'}
                      </td>

                      <td className="px-4 py-3">
                        {stock}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            stock === 0
                              ? 'bg-red-100 text-red-700'
                              : stock <= 10
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {stock === 0
                            ? 'Sin stock'
                            : stock <= 10
                            ? 'Stock bajo'
                            : 'Disponible'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-slate-900">
          Lotes disponibles
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Vencimiento</th>
                <th className="px-4 py-3">Stock actual</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id} className="border-b">
                  <td className="px-4 py-3 font-semibold">
                    {lot.batchNumber}
                  </td>

                  <td className="px-4 py-3">
                    {lot.product?.name || '-'}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(lot.expirationDate).toLocaleDateString()}
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
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-slate-900">
          Movimientos recientes
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Producto ID</th>
                <th className="px-4 py-3">Lote ID</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Detalle</th>
              </tr>
            </thead>

            <tbody>
              {movements.map((movement) => (
                <tr key={movement.id} className="border-b">
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {movement.type}
                    </span>
                  </td>

                  <td className="px-4 py-3">{movement.productId}</td>
                  <td className="px-4 py-3">{movement.lotId}</td>
                  <td className="px-4 py-3">{movement.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {movement.detail}
                  </td>
                </tr>
              ))}

              {movements.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No existen movimientos registrados.
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
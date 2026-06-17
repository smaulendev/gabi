import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    barcode: "",
    requiresColdChain: false,
    minTemperature: 2,
    maxTemperature: 8,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/products", form);

      toast.success("Producto creado correctamente");

      setForm({
        sku: "",
        name: "",
        description: "",
        category: "",
        barcode: "",
        requiresColdChain: false,
        minTemperature: 2,
        maxTemperature: 8,
      });

      loadProducts();
    } catch {
      toast.error(
        "Error al crear producto. Verifica el SKU, código de barras o los datos ingresados."
      );
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Productos</h1>

        <p className="mt-2 text-slate-500">
          Gestión de bio-insumos registrados en GABI.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-1">
            <h2 className="text-xl font-bold text-slate-900">Crear producto</h2>

            <form onSubmit={createProduct} className="mt-6 space-y-4">
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />

              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="Categoría"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="Código de barras"
                value={form.barcode}
                onChange={(e) =>
                  setForm({ ...form, barcode: e.target.value })
                }
                required
              />

              <textarea
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="Descripción"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.requiresColdChain}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      requiresColdChain: e.target.checked,
                    })
                  }
                />
                Requiere cadena de frío
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  placeholder="Temp. mín."
                  value={form.minTemperature}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minTemperature: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                  placeholder="Temp. máx."
                  value={form.maxTemperature}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxTemperature: Number(e.target.value),
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Guardar producto
              </button>
            </form>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">
              Productos registrados
            </h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Cadena frío</th>
                    <th className="px-4 py-3">Rango temp.</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{product.sku}</td>

                      <td className="px-4 py-3">
                        {product.barcode || "-"}
                      </td>

                      <td className="px-4 py-3">{product.name}</td>

                      <td className="px-4 py-3">
                        {product.category || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.requiresColdChain
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {product.requiresColdChain ? "Sí" : "No"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {product.minTemperature ?? "-"}°C /{" "}
                        {product.maxTemperature ?? "-"}°C
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-slate-500"
                      >
                        No existen productos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const emptyForm = {
    sku: "",
    name: "",
    description: "",
    category: "",
    chemicalFamily: "",
    barcode: "",
    minStock: 10,
    requiresColdChain: false,
    minTemperature: 2,
    maxTemperature: 8,
  };

  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

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
      setForm(emptyForm);
      loadProducts();
    } catch {
      toast.error("Error al crear producto. Verifica el SKU o código.");
    }
  };

  const startEdit = (product: any) => {
    setEditingProductId(product.id);
    setEditForm({
      sku: product.sku || "",
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      chemicalFamily: product.chemicalFamily || "",
      barcode: product.barcode || "",
      minStock: product.minStock ?? 10,
      requiresColdChain: product.requiresColdChain || false,
      minTemperature: product.minTemperature ?? 2,
      maxTemperature: product.maxTemperature ?? 8,
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditForm(emptyForm);
  };

  const saveEdit = async (id: number) => {
    try {
      await api.patch(`/products/${id}`, editForm);
      toast.success("Producto actualizado correctamente");
      setEditingProductId(null);
      loadProducts();
    } catch {
      toast.error("Error al actualizar producto");
    }
  };

  const disableProduct = async (id: number) => {
    const confirmDisable = window.confirm(
      "¿Seguro que deseas desactivar este producto?"
    );

    if (!confirmDisable) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Producto desactivado correctamente");
      loadProducts();
    } catch {
      toast.error("Error al desactivar producto");
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
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />

              <select
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                value={form.chemicalFamily}
                onChange={(e) =>
                  setForm({ ...form, chemicalFamily: e.target.value })
                }
              >
                <option value="">Familia química</option>
                <option value="ACIDO">Ácido</option>
                <option value="BASE">Base</option>
                <option value="OXIDANTE">Oxidante</option>
                <option value="INFLAMABLE">Inflamable</option>
                <option value="BIOLOGICO">Biológico</option>
                <option value="REACTIVO_GENERAL">Reactivo general</option>
              </select>

              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="Código de barras / QR"
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                required
              />

              <input
                type="number"
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
                placeholder="Stock mínimo"
                value={form.minStock}
                onChange={(e) =>
                  setForm({ ...form, minStock: Number(e.target.value) })
                }
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
                    <th className="px-4 py-3">Familia</th>
                    <th className="px-4 py-3">Stock mín.</th>
                    <th className="px-4 py-3">Frío</th>
                    <th className="px-4 py-3">Rango temp.</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const isEditing = editingProductId === product.id;

                    return (
                      <tr key={product.id} className="border-b">
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="w-28 rounded-lg border px-2 py-1"
                              value={editForm.sku}
                              onChange={(e) =>
                                setEditForm({ ...editForm, sku: e.target.value })
                              }
                            />
                          ) : (
                            product.sku
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="w-32 rounded-lg border px-2 py-1"
                              value={editForm.barcode}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  barcode: e.target.value,
                                })
                              }
                            />
                          ) : (
                            product.barcode || "-"
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="w-40 rounded-lg border px-2 py-1"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            product.name
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="w-32 rounded-lg border px-2 py-1"
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  category: e.target.value,
                                })
                              }
                            />
                          ) : (
                            product.category || "-"
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              className="rounded-lg border px-2 py-1"
                              value={editForm.chemicalFamily}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  chemicalFamily: e.target.value,
                                })
                              }
                            >
                              <option value="">-</option>
                              <option value="ACIDO">Ácido</option>
                              <option value="BASE">Base</option>
                              <option value="OXIDANTE">Oxidante</option>
                              <option value="INFLAMABLE">Inflamable</option>
                              <option value="BIOLOGICO">Biológico</option>
                              <option value="REACTIVO_GENERAL">
                                Reactivo general
                              </option>
                            </select>
                          ) : (
                            product.chemicalFamily || "-"
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-24 rounded-lg border px-2 py-1"
                              value={editForm.minStock}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  minStock: Number(e.target.value),
                                })
                              }
                            />
                          ) : (
                            product.minStock ?? 10
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={editForm.requiresColdChain}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  requiresColdChain: e.target.checked,
                                })
                              }
                            />
                          ) : (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                product.requiresColdChain
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {product.requiresColdChain ? "Sí" : "No"}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <input
                                type="number"
                                className="w-20 rounded-lg border px-2 py-1"
                                value={editForm.minTemperature}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    minTemperature: Number(e.target.value),
                                  })
                                }
                              />
                              <input
                                type="number"
                                className="w-20 rounded-lg border px-2 py-1"
                                value={editForm.maxTemperature}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    maxTemperature: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <>
                              {product.minTemperature ?? "-"}°C /{" "}
                              {product.maxTemperature ?? "-"}°C
                            </>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(product.id)}
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                              >
                                Guardar
                              </button>

                              <button
                                onClick={cancelEdit}
                                className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(product)}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => disableProduct(product.id)}
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                Desactivar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
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
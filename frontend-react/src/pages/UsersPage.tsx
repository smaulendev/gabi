import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { toast } from "react-toastify";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "OPERADOR",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await api.get("/users");
    setUsers(response.data);
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/users", form);

      toast.success("Usuario creado correctamente");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "OPERADOR",
      });

      loadUsers();
    } catch {
      toast.error("Error al crear usuario. Verifica el correo o los datos.");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>

      <p className="mt-2 text-slate-500">
        Administración de cuentas y roles del sistema G.A.B.I.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-1">
          <h2 className="text-xl font-bold text-slate-900">Crear usuario</h2>

          <form onSubmit={createUser} className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Correo"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="ADMIN">Administrador</option>
              <option value="OPERADOR">Operador</option>
              <option value="AUDITOR">Auditor</option>
            </select>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Crear usuario
            </button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">
            Usuarios registrados
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-600">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Creado</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No existen usuarios registrados.
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
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 p-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">G.A.B.I</h1>

        <p className="mt-1 text-sm text-slate-400">Gestión Inteligente</p>
      </div>

      <div className="mt-8 rounded-lg bg-slate-800 p-3">
        <p className="text-xs text-slate-400">Usuario conectado</p>

        <p className="font-semibold">{user?.email || "Administrador"}</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-3">
        <Link
          to="/dashboard"
          className="rounded-lg px-3 py-2 hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          to="/products"
          className="rounded-lg px-3 py-2 hover:bg-slate-800"
        >
          Productos
        </Link>

        <Link to="/scanner" className="rounded-lg px-3 py-2 hover:bg-slate-800">
          Escáner QR
        </Link>

        <Link to="/lots" className="rounded-lg px-3 py-2 hover:bg-slate-800">
          Lotes FEFO
        </Link>

        <Link
          to="/inventory"
          className="rounded-lg px-3 py-2 hover:bg-slate-800"
        >
          Inventario
        </Link>
        <Link
          to="/movements"
          className="rounded-lg px-3 py-2 hover:bg-slate-800"
        >
          Movimientos
        </Link>

        <Link to="/alerts" className="rounded-lg px-3 py-2 hover:bg-slate-800">
          Alertas
        </Link>

        <Link to="/sensors" className="rounded-lg px-3 py-2 hover:bg-slate-800">
          Sensores
        </Link>
      </nav>

      <button
        onClick={logout}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

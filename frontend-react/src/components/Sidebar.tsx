import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 text-white lg:hidden">
        <div>
          <h1 className="text-xl font-bold">G.A.B.I</h1>
          <p className="text-xs text-slate-400">Gestión Inteligente</p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold"
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>

      <aside
        className={`z-50 bg-slate-900 p-6 text-white transition-all lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col ${
          open ? 'block' : 'hidden'
        } lg:block`}
      >
        <div>
          <h1 className="text-2xl font-bold">G.A.B.I</h1>
          <p className="mt-1 text-sm text-slate-400">Gestión Inteligente</p>
        </div>

        <div className="mt-8 rounded-lg bg-slate-800 p-3">
          <p className="text-xs text-slate-400">Usuario conectado</p>
          <p className="break-words font-semibold">
            {user?.email || 'Administrador'}
          </p>
        </div>

        <nav className="mt-8 flex flex-col gap-3 lg:flex-1">
          <Link onClick={closeMenu} to="/dashboard" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Dashboard
          </Link>

          <Link onClick={closeMenu} to="/products" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Productos
          </Link>

          <Link onClick={closeMenu} to="/lots" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Lotes FEFO
          </Link>

          <Link onClick={closeMenu} to="/inventory" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Inventario
          </Link>

          <Link onClick={closeMenu} to="/movements" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Movimientos
          </Link>

          <Link onClick={closeMenu} to="/alerts" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Alertas
          </Link>

          <Link onClick={closeMenu} to="/sensors" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Sensores
          </Link>

          <Link onClick={closeMenu} to="/scanner" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Escáner QR
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}
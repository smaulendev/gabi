import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  Boxes,
  Archive,
  Thermometer,
  QrCode,
  ArrowLeftRight,
  Bell,
  ShieldCheck,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import logo from "../assets/gabi-logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = String(user?.role || "").toUpperCase();

  const isAdmin = role === "ADMIN";
  const isOperator = role === "OPERADOR" || role === "OPERATOR";
  const isAuditor = role === "AUDITOR";

  const canManageOperations = isAdmin || isOperator;
  const canViewAudit = isAdmin || isAuditor;

  const roleLabel =
    role === "ADMIN"
      ? "Administrador"
      : role === "AUDITOR"
      ? "Auditor"
      : role === "OPERADOR"
      ? "Operador"
      : "Sin rol";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  const menuItemClass = (path: string) => {
    const active = location.pathname === path;

    return `
      flex items-center gap-4
      rounded-2xl
      px-4 py-3.5
      text-sm font-semibold
      transition-all duration-300
      ${
        active
          ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-900/40"
          : "text-slate-200 hover:bg-white/10 hover:text-white"
      }
    `;
  };

  return (
    <>
      {/* HEADER MOBILE */}

      <div className="sticky top-0 z-50 flex items-center justify-between bg-[#08112B] px-4 py-3 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="GABI"
            className="h-10 w-10 object-contain"
          />

          <div>
            <h1 className="font-bold tracking-wider">
              G.A.B.I
            </h1>

            <p className="text-xs text-slate-300">
              Gestión Inteligente
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl bg-white/10 p-2 backdrop-blur transition hover:bg-white/20"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72
          text-white
          transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#07112F] via-[#0B1740] to-[#07112F] shadow-2xl">
          {/* EFECTOS */}

          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative z-10 flex flex-1 flex-col p-6">
            {/* LOGO */}

            <div className="flex flex-col items-center">
              <div className="rounded-3xl bg-white p-3 shadow-2xl">
                <img
                  src={logo}
                  alt="GABI"
                  className="h-24 w-24 object-contain"
                />
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-[0.25em]">
                G.A.B.I
              </h1>

              <p className="mt-1 text-sm text-slate-300">
                Gestión Inteligente
              </p>
            </div>

            {/* USUARIO */}

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold">
                  {user?.email
                    ? user.email.charAt(0).toUpperCase()
                    : "U"}

                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0B1740] bg-green-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Usuario conectado
                  </p>

                  <p className="truncate text-sm font-bold text-white">
                    {user?.email || "Sin usuario"}
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-1 text-[10px] font-bold text-white">
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* MENU */}

            <nav className="mt-8 flex flex-col gap-2">
              <Link
                onClick={closeMenu}
                to="/dashboard"
                className={menuItemClass("/dashboard")}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>

              {canManageOperations && (
                <>
                  <Link
                    onClick={closeMenu}
                    to="/products"
                    className={menuItemClass("/products")}
                  >
                    <Package size={20} />
                    Productos
                  </Link>

                  <Link
                    onClick={closeMenu}
                    to="/lots"
                    className={menuItemClass("/lots")}
                  >
                    <Boxes size={20} />
                    Lotes FEFO
                  </Link>

                  <Link
                    onClick={closeMenu}
                    to="/inventory"
                    className={menuItemClass("/inventory")}
                  >
                    <Archive size={20} />
                    Inventario
                  </Link>

                  <Link
                    onClick={closeMenu}
                    to="/sensors"
                    className={menuItemClass("/sensors")}
                  >
                    <Thermometer size={20} />
                    Sensores
                  </Link>

                  <Link
                    onClick={closeMenu}
                    to="/scanner"
                    className={menuItemClass("/scanner")}
                  >
                    <QrCode size={20} />
                    Escáner QR
                  </Link>
                </>
              )}

              <Link
                onClick={closeMenu}
                to="/movements"
                className={menuItemClass("/movements")}
              >
                <ArrowLeftRight size={20} />
                Movimientos
              </Link>

              <Link
                onClick={closeMenu}
                to="/alerts"
                className={menuItemClass("/alerts")}
              >
                <Bell size={20} />
                Alertas
              </Link>

              {canViewAudit && (
                <Link
                  onClick={closeMenu}
                  to="/audit"
                  className={menuItemClass("/audit")}
                >
                  <ShieldCheck size={20} />
                  Auditoría
                </Link>
              )}

              {isAdmin && (
                <Link
                  onClick={closeMenu}
                  to="/users"
                  className={menuItemClass("/users")}
                >
                  <Users size={20} />
                  Usuarios
                </Link>
              )}
            </nav>

            {/* FOOTER */}

            <div className="mt-auto pt-8">
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

import logo from "../assets/gabi-logo.png";

import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060B23] px-4">
      {/* EFECTOS FONDO */}

      <div className="absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* CARD */}

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[32px] border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
          {/* LOGO */}

          <div className="flex flex-col items-center">
            <div className="rounded-3xl bg-white p-4 shadow-lg">
              <img
                src={logo}
                alt="GABI"
                className="h-24 w-24 object-contain"
              />
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-[0.25em] text-slate-900">
              G.A.B.I
            </h1>

            <p className="mt-2 text-center text-slate-500">
              Gestión Inteligente de Inventario
            </p>
          </div>

          {/* FORM */}

          <form
            onSubmit={login}
            className="mt-8 space-y-5"
          >
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-4
                  pl-12
                  pr-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
                required
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-4
                  pl-12
                  pr-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                via-indigo-500
                to-violet-600
                py-4
                font-bold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              Ingresar al sistema

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* FOOTER */}

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              GABI • Gestión Inteligente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
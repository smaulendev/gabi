import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function StatCard({
  title,
  value,
  icon,
  variant = "default",
}: Props) {
  const variants = {
    default:
      "bg-white/90 border-white/70 backdrop-blur-md",

    success:
      "bg-white/90 border-green-100 backdrop-blur-md",

    warning:
      "bg-white/90 border-yellow-100 backdrop-blur-md",

    danger:
      "bg-red-50/90 border-red-100 backdrop-blur-md",
  };

  const iconVariants = {
    default:
      "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600",

    success:
      "bg-gradient-to-br from-green-100 to-emerald-100 text-green-600",

    warning:
      "bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-600",

    danger:
      "bg-gradient-to-br from-red-100 to-pink-100 text-red-600",
  };

  const progressVariants = {
    default:
      "bg-gradient-to-r from-blue-500 to-indigo-500",

    success:
      "bg-gradient-to-r from-green-500 to-emerald-500",

    warning:
      "bg-gradient-to-r from-yellow-500 to-orange-500",

    danger:
      "bg-gradient-to-r from-red-500 to-pink-500",
  };

  return (
    <div
      className={`
        group
        rounded-3xl
        border
        p-6
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
        ${variants[variant]}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-5xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            shadow-md
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:rotate-3
            ${iconVariants[variant]}
          `}
        >
          {icon}
        </div>
      </div>

      <div className="mt-6 h-1.5 w-full rounded-full bg-slate-100">
        <div
          className={`
            h-1.5
            w-full
            rounded-full
            ${progressVariants[variant]}
          `}
        />
      </div>
    </div>
  );
}
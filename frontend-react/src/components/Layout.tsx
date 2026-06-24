import Sidebar from "./Sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F6F8FF] lg:flex">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <Sidebar />

      <main className="relative z-10 min-h-screen w-full flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px] pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
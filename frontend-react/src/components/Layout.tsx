import Sidebar from './Sidebar';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="w-full flex-1 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
import Sidebar from './Sidebar';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: '20px',
          background: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
}
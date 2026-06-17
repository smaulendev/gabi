import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        background: '#0f172a',
        color: 'white',
        padding: '20px',
      }}
    >
      <h2>G.A.B.I</h2>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginTop: '30px',
        }}
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Productos</Link>
        <Link to="/lots">Lotes</Link>
        <Link to="/alerts">Alertas</Link>
        <Link to="/sensors">Sensores</Link>
      </nav>
    </div>
  );
}
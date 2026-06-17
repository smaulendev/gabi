import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import LotsPage from './pages/LotsPage';
import AlertsPage from './pages/AlertsPage';
import SensorsPage from './pages/SensorsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/lots" element={<LotsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/sensors" element={<SensorsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
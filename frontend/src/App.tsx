import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, type JSX } from 'react';
import EmpresaPage from './pages/EmpresaPage';
import ProductoPage from './pages/ProductoPage';
import LoginPage from './pages/LoginPage';
import { logout, isAuthenticated } from './api/authService';
import InventarioPage from './pages/InventarioPage';

// Componente para proteger rutas (si no está logueado, manda al login)
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar solo si está autenticado */}
        {isAuth && (
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="shrink-0 flex items-center">
                    <span className="font-bold text-xl text-blue-600">LiteThinking</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link to="/" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Empresas</Link>
                    <Link to="/productos" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Productos</Link>
                    <Link to="/inventario" className="border-transparent text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Inventario</Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">Cerrar Sesión</button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <div className="py-10">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rutas Protegidas */}
            <Route path="/" element={
              <PrivateRoute><EmpresaPage /></PrivateRoute>
            } />
            <Route path="/productos" element={
              <PrivateRoute><ProductoPage /></PrivateRoute>
            } />
            <Route path="/inventario" element={
              <PrivateRoute><InventarioPage /></PrivateRoute>
            } />

            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import { useEffect, useState } from 'react';
import { getEmpresas } from '../api/empresaService';
import type { Empresa } from '../types';
import { EmpresaForm } from '../components/organisms/EmpresaForm';
import { isAdmin } from '../api/authService';

const EmpresaPage = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const cargarEmpresas = () => {
    getEmpresas()
      .then((data) => setEmpresas(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Gestión de empresas</h1>
        
        {isAdmin() && (
        <EmpresaForm onSuccess={cargarEmpresas} />
        )}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listado de empresas</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {empresas.map((emp) => (
                <li key={emp.nit} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">{emp.nombre}</p>
                      <p className="ml-1 text-sm text-gray-500">NIT: {emp.nit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{emp.telefono}</p>
                      <p className="text-sm text-gray-500">{emp.direccion}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpresaPage;
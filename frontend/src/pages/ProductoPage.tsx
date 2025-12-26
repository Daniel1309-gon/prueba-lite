import { useEffect, useState } from "react";
import { getProductos } from "../api/productoService";
import type { Producto } from "../types";
import { ProductoForm } from "../components/organisms/ProductoForm";
import { isAdmin } from "../api/authService";

const ProductoPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const cargarProductos = () => {
    getProductos().then(setProductos).catch(console.error);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Gestión de productos
        </h1>

        {isAdmin() && <ProductoForm onSuccess={cargarProductos} />}

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Inventario actual
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {productos.map((prod) => (
              <div
                key={prod.id || prod.codigo}
                className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {prod.nombre}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {prod.codigo}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {prod.caracteristicas}
                </p>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      COP: ${prod.precio_cop}
                    </p>
                    <p className="text-sm text-gray-500">
                      USD: ${prod.precio_usd}
                    </p>
                  </div>
                  {/* Aquí mostramos la empresa si el backend envía el nombre */}
                  <p className="text-xs text-gray-400 italic">
                    {prod.nombre_empresa || "Empresa ID: " + prod.empresa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoPage;

import React, { useState, useEffect } from 'react';
import { FormField } from '../molecules/FormField';
import { FormSelect } from '../molecules/FormSelect';// Asegúrate de importar la nueva molécula
import { Button } from '../atoms/Button';
import { Label } from '../atoms/Label';
import { TextArea } from '../atoms/TextArea';
import { createProducto } from '../../api/productoService';
import { getEmpresas } from '../../api/empresaService';
import type { Producto, Empresa } from '../../types';

interface ProductoFormProps {
  onSuccess: () => void;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({ onSuccess }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formData, setFormData] = useState<Producto>({
    codigo: '',
    nombre: '',
    caracteristicas: '',
    precio_cop: 0,
    precio_usd: 0,
    empresa: ''
  });

  // Cargar empresas al iniciar para llenar el Select
  useEffect(() => {
    getEmpresas().then(setEmpresas).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProducto(formData);
      alert('Producto creado con éxito');
      setFormData({ codigo: '', nombre: '', caracteristicas: '', precio_cop: 0, precio_usd: 0, empresa: '' });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error al crear producto');
    }
  };

  // Convertir empresas al formato que pide el Select
  const opcionesEmpresas = empresas.map(e => ({ value: e.nit, label: e.nombre }));

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Registrar Nuevo Producto</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Código" name="codigo" value={formData.codigo} onChange={handleChange} required />
        <FormField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>

      <div className="mb-4">
        <Label htmlFor="caracteristicas">Características</Label>
        <TextArea id="caracteristicas" name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Precio COP" name="precio_cop" type="number" value={formData.precio_cop} onChange={handleChange} required />
        <FormField label="Precio USD" name="precio_usd" type="number" value={formData.precio_usd} onChange={handleChange} required />
      </div>

      <FormSelect 
        label="Empresa" 
        name="empresa" 
        value={formData.empresa} 
        onChange={handleChange} 
        options={opcionesEmpresas} 
        required 
      />

      <div className="mt-6">
        <Button type="submit">Guardar Producto</Button>
      </div>
    </form>
  );
};
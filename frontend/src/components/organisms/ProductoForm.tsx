import React, { useState, useEffect } from "react";
import { FormField } from "../molecules/FormField";
import { FormSelect } from "../molecules/FormSelect";
import { Button } from "../atoms/Button";
import { Label } from "../atoms/Label";
import { TextArea } from "../atoms/TextArea";
import { createProducto } from "../../api/productoService";
import { getEmpresas } from "../../api/empresaService";
import type { Producto, Empresa } from "../../types";
import { generateDescriptionAI } from "../../api/productoService";

interface ProductoFormProps {
  onSuccess: () => void;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({ onSuccess }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formData, setFormData] = useState<Producto>({
    codigo: "",
    nombre: "",
    caracteristicas: "",
    precio_cop: 0,
    precio_usd: 0,
    empresa: "",
  });
  const [generating, setGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!formData.nombre) {
      alert(
        "Por favor ingresa el nombre del producto para generar la descripción."
      );
      return;
    }
    setGenerating(true);
    try {
      const descripcion = await generateDescriptionAI(formData.nombre);
      setFormData((prev) => ({ ...prev, caracteristicas: descripcion }));
    } catch (error) {
      alert("Error al generar la descripción.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    getEmpresas().then(setEmpresas).catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProducto(formData);
      alert("Producto creado con éxito");
      setFormData({
        codigo: "",
        nombre: "",
        caracteristicas: "",
        precio_cop: 0,
        precio_usd: 0,
        empresa: "",
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al crear producto");
    }
  };

  const opcionesEmpresas = empresas.map((e) => ({
    value: e.nit,
    label: e.nombre,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
        Registrar nuevo producto
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          required
        />
        <FormField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="caracteristicas">Características</Label>
        <div className="flex justify-between items-end mb-1">
          <Button
            onClick={handleGenerateAI}
            disabled={generating}
          >
            {generating ? "Generando" : "Generar con Gemini"}
          </Button>
        </div>
        <TextArea
          id="caracteristicas"
          name="caracteristicas"
          value={formData.caracteristicas}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Precio COP"
          name="precio_cop"
          type="number"
          value={formData.precio_cop}
          onChange={handleChange}
          required
        />
        <FormField
          label="Precio USD"
          name="precio_usd"
          type="number"
          value={formData.precio_usd}
          onChange={handleChange}
          required
        />
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

import React, { useState } from "react";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { createEmpresa } from "../../api/empresaService";
import type { Empresa } from "../../types";

interface EmpresaFormProps {
  onSuccess: () => void;
}

export const EmpresaForm: React.FC<EmpresaFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Empresa>({
    nit: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmpresa(formData);
      alert("Empresa creada con éxito");
      setFormData({ nit: "", nombre: "", direccion: "", telefono: "" });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al crear la empresa");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
        Registrar nueva empresa
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="NIT"
          name="nit"
          value={formData.nit}
          onChange={handleChange}
          placeholder="Ej: 900123456"
          required
        />
        <FormField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Tech Solutions"
          required
        />
      </div>

      <FormField
        label="Dirección"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="Calle 123 # 45-67"
        required
      />
      <FormField
        label="Teléfono"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="300 123 4567"
        required
      />

      <div className="mt-6">
        <Button type="submit">Guardar Empresa</Button>
      </div>
    </form>
  );
};

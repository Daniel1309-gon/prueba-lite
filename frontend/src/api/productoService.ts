import client from "./client";
import type { Producto } from "../types";

export const getProductos = async () => {
  const response = await client.get<Producto[]>("/productos/");
  return response.data;
};

export const createProducto = async (producto: Producto) => {
  const response = await client.post<Producto>("/productos/", producto);
  return response.data;
};

export const downloadInventarioPDF = async () => {
  const response = await client.get("/productos/inventario_pdf/", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "inventario_productos.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
  return response.data;
};

export const sendInventarioEmail = async (email: string) => {
  const response = await client.post("/productos/inventario_pdf/", { email });
  return response.data;
};

export const generateDescriptionAI = async (nombre: string) => {
  const response = await client.post("productos/generar_descripcion/", {
    nombre,
  });
  return response.data.descripcion;
};

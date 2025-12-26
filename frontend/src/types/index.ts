export interface Empresa {
  nit: string;
  nombre: string;
  direccion: string;
  telefono: string;
}


export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  caracteristicas: string;
  precio_cop: number;
  precio_usd: number;
  empresa: string;
  nombre_empresa?: string;
}
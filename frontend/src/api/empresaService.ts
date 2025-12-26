import client from './client';

import type { Empresa } from '../types';

export const getEmpresas = async () => {
    const response = await client.get<Empresa[]>('/empresas/');
    return response.data;
}

export const createEmpresa = async (empresa: Empresa) => {
    const response = await client.post<Empresa>('/empresas/', empresa);
    return response.data;
}
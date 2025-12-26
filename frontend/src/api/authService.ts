import client from "./client";

export const login = async (username: string, password: string) => {
    const response = await client.post('/token/', { username, password });

    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('isAdmin', JSON.stringify(response.data.is_admin));
    }

    return response.data;
};

export const isAdmin = (): boolean => {
    const val = localStorage.getItem('isAdmin');
    return val === 'true';
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};
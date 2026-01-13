import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api'
});

export const searchSwapi = async (query: string, type: 'people' | 'movies') => {
    const response = await apiClient.get('/search', { params: { q: query, type } });
    return response.data;
};

export const getStats = async () => {
    const response = await apiClient.get('/stats');
    return response.data;
};

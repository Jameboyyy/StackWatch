const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getMetrics = async () => {
    const response = await fetch('http://localhost:3000/metrics');
    if(!response.ok) {
        throw new Error('Failed to fetch metrics');
    }

    return response.json();
};
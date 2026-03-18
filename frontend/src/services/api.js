export const getMetrics = async () => {
    const response = await fetch('http://localhost:3000/metrics');
    if(!response.ok) {
        throw new Error('Failed to fetch metrics');
    }

    return response.json();
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://54.219.130.131:3000';

export const getMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }

  return response.json();
};
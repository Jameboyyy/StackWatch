export const getMetrics = async () => {
  const response = await fetch('/api/metrics');

  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }

  return response.json();
};
import { fetchMetrics } from '../services/metrics.service.js';;

export const getMetrics = async (req, res) => {
    try {
        const metrics = await fetchMetrics();
        res.status(200).json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error)
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};


import { fetchPrometheusMetrics } from "../services/prometheus.service.js";

export const getPrometheusMetrics = async (req, res) => {
    try {
        const { contentType, metrics } = await fetchPrometheusMetrics();
        res.set('Content-Type', contentType);
        res.status(200).send(metrics);
    } catch (error){
        console.error('Error fetching Prometheus metrics:', error);
        res.status(500).json({ error: 'Failed to fetch Prometheus metrics' });
    }
};
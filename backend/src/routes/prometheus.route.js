import express from 'express';
import { getPrometheusMetrics } from '../controllers/prometheus.controller.js';

const router = express.Router();

router.get('/', getPrometheusMetrics);

export default router;
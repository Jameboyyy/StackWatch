import client from 'prom-client';
import si from 'systeminformation';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const cpuUsageGauge =
  register.getSingleMetric('stackwatch_cpu_usage_percent') ||
  new client.Gauge({
    name: 'stackwatch_cpu_usage_percent',
    help: 'Current CPU usage percentage',
    registers: [register],
  });

const memoryUsageGauge =
  register.getSingleMetric('stackwatch_memory_usage_percent') ||
  new client.Gauge({
    name: 'stackwatch_memory_usage_percent',
    help: 'Current memory usage percentage',
    registers: [register],
  });

const memoryUsedBytesGauge =
  register.getSingleMetric('stackwatch_memory_used_bytes') ||
  new client.Gauge({
    name: 'stackwatch_memory_used_bytes',
    help: 'Current used memory in bytes',
    registers: [register],
  });

const memoryTotalBytesGauge =
  register.getSingleMetric('stackwatch_memory_total_bytes') ||
  new client.Gauge({
    name: 'stackwatch_memory_total_bytes',
    help: 'Current total memory in bytes',
    registers: [register],
  });

export const fetchPrometheusMetrics = async () => {
  const [load, mem] = await Promise.all([
    si.currentLoad(),
    si.mem(),
  ]);

  const cpuUsage = load.currentLoad || 0;
  const memoryUsage = mem.total ? (mem.used / mem.total) * 100 : 0;

  cpuUsageGauge.set(cpuUsage);
  memoryUsageGauge.set(memoryUsage);
  memoryUsedBytesGauge.set(mem.used);
  memoryTotalBytesGauge.set(mem.total);

  return {
    contentType: register.contentType,
    metrics: await register.metrics(),
  };
};
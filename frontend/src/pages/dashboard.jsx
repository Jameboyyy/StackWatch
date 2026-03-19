import React, { useEffect, useState } from 'react';
import { getMetrics } from '../services/api';
import MetricCard from '../components/metricCard';
import MetricChart from '../components/metricChart';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
        setLastUpdated(new Date());

        const point = {
          time: new Date().toLocaleTimeString(),
          cpu: Number(data.cpu.usage.toFixed(2)),
          memory: Number(data.memory.usage.toFixed(2)),
        };

        setHistory((prev) => [...prev, point].slice(-12));
      } catch (error) {
        console.error(error);
      }
    };

    fetchMetricsData();

    const interval = setInterval(() => {
      fetchMetricsData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value) => {
    if (value >= 85) return 'critical';
    if (value >= 60) return 'warning';
    return 'healthy';
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>StackWatch</h1>
        <p>System Monitoring Dashboard</p>
        <p className="last__updated">
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleString()}`
            : 'Loading...'}
        </p>
      </div>

      {!metrics ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="metrics__grid">
            <MetricCard
              title="CPU Usage"
              value={`${metrics.cpu.usage.toFixed(2)}%`}
              status={getMetricStatus(metrics.cpu.usage)}
            />

            <MetricCard
              title="Memory Usage"
              value={`${metrics.memory.usage.toFixed(2)}%`}
              subtext={`${metrics.memory.used.toFixed(2)} GB used • ${metrics.memory.available.toFixed(2)} GB available • ${metrics.memory.total.toFixed(2)} GB total`}
              status={getMetricStatus(metrics.memory.usage)}
            />

            {metrics.disks && metrics.disks.length > 0 ? (
              metrics.disks.map((disk) => (
                <MetricCard
                  key={disk.mount || disk.filesystem}
                  title={`Disk Usage (${disk.mount || disk.filesystem})`}
                  value={`${disk.usage.toFixed(2)}%`}
                  subtext={`${disk.used.toFixed(2)} GB used • ${disk.free.toFixed(2)} GB free • ${disk.total.toFixed(2)} GB total`}
                  status={getMetricStatus(disk.usage)}
                />
              ))
            ) : (
              <MetricCard
                title="Disk Usage"
                value="N/A"
                subtext="No disk data"
                status="healthy"
              />
            )}
          </div>

          <div className="charts__grid">
            <MetricChart
              title="CPU Usage Over Time"
              data={history}
              dataKey="cpu"
              color="#22c55e"
            />

            <MetricChart
              title="Memory Usage Over Time"
              data={history}
              dataKey="memory"
              color="#3b82f6"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
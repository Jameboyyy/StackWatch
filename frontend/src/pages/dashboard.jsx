import React, { useEffect, useRef, useState } from 'react';
import { getMetrics } from '../services/api';
import MetricCard from '../components/metricCard';
import MetricChart from '../components/metricChart';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [metricStatuses, setMetricStatuses] = useState({
    cpu: 'normal',
    memory: 'normal',
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState([]);
  const [alertLog, setAlertLog] = useState([]);

  const lastAlertValuesRef = useRef({
    cpu: null,
    memory: null,
  });

  const alertDelta = 5;

  const getMetricStatus = (value) => {
    if (value >= 85) return 'critical';
    if (value >= 60) return 'warning';
    return 'normal';
  };

  const statusPriority = {
    normal: 0,
    warning: 1,
    critical: 2,
  };

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

        setMetricStatuses((prevStatuses) => {
          const newStatuses = {
            cpu: getMetricStatus(data.cpu.usage),
            memory: getMetricStatus(data.memory.usage),
          };

          const alerts = [];

          Object.keys(newStatuses).forEach((metric) => {
            const prevStatus = prevStatuses[metric];
            const nextStatus = newStatuses[metric];
            const value = Number(data[metric].usage.toFixed(2));
            const lastAlertValue = lastAlertValuesRef.current[metric];

            const gotWorse =
              statusPriority[nextStatus] > statusPriority[prevStatus];

            const sameSeverity =
              statusPriority[nextStatus] === statusPriority[prevStatus] &&
              nextStatus !== 'normal';

            const increasedEnough =
              lastAlertValue === null || value >= lastAlertValue + alertDelta;

            if (gotWorse || (sameSeverity && increasedEnough)) {
              alerts.push({
                id: `${metric}-${Date.now()}-${Math.random()}`,
                metric,
                value,
                status: nextStatus,
                message: `${metric.toUpperCase()} entered ${nextStatus} state at ${value}%`,
                time: new Date().toLocaleTimeString(),
              });

              lastAlertValuesRef.current[metric] = value;
            }

            if (nextStatus === 'normal') {
              lastAlertValuesRef.current[metric] = null;
            }
          });

          if (alerts.length > 0) {
            setAlertLog((prevLog) => {
              const filteredAlerts = alerts.filter((alert) => {
                return !prevLog.some(
                  (existingAlert) =>
                    existingAlert.metric === alert.metric &&
                    existingAlert.status === alert.status &&
                    existingAlert.value === alert.value
                );
              });
              return [...filteredAlerts, ...prevLog].slice(0,20);
            });
          }

          return newStatuses;
        });
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
                status="normal"
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

          <div className="alert__log">
            <h2 className="alert__log--title">Alert Log</h2>

            {alertLog.length === 0 ? (
              <p>No alerts yet.</p>
            ) : (
              <ul>
                {alertLog.map((alert) => (
                  <li key={alert.id} className={`alert__item ${alert.status}`}>
                    <strong>{alert.metric.toUpperCase()}</strong> - {alert.message}
                    <div>{alert.time}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
      <footer className="dashboard__footer">
        <p>StackWatch &copy; 2026</p>
      </footer>
    </div>
  );
};

export default Dashboard;
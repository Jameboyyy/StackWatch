import React, { useState, useEffect} from 'react';
import './dashboard.css'
import { getMetrics } from '../services/api';
import MetricCard from '../components/metricCard';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);


    useEffect(() => {
        const fetchMetricsData = async () => {
            try {
                const data = await getMetrics();
                setMetrics(data);
                setLastUpdated(new Date());
            } catch(error) {
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
      
              <MetricCard
                title="Disk Usage"
                value={
                  metrics.disk[0]
                    ? `${metrics.disk[0].usage.toFixed(2)}%`
                    : 'N/A'
                }
                subtext={
                  metrics.disk[0]
                    ? `${metrics.disk[0].used.toFixed(2)} GB / ${metrics.disk[0].total.toFixed(2)} GB`
                    : 'No disk data'
                }
                status={
                    metrics.disk[0]
                    ? getMetricStatus(metrics.disk[0].usage)
                    : 'healthy'
                }
              />
            </div>
          )}
        </div>
      );
}

export default Dashboard;

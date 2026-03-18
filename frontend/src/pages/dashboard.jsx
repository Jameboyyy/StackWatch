import React, { useState, useEffect} from 'react';
import { getMetrics } from '../services/api';
import MetricCard from '../components/metricCard';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchMetricsData = async () => {
            try {
                const data = await getMetrics();
                setMetrics(data);
            } catch(error) {
                console.error(error);
            }
        };
        fetchMetricsData();

    }, []);

    return (
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>StackWatch</h1>
            <p>System Monitoring Dashboard</p>
          </div>
      
          {!metrics ? (
            <p>Loading...</p>
          ) : (
            <div className="metrics__grid">
              <MetricCard
                title="CPU Usage"
                value={`${metrics.cpu.usage.toFixed(2)}%`}
              />
      
              <MetricCard
                title="Memory Usage"
                value={`${metrics.memory.usage.toFixed(2)}%`}
                subtext={`${metrics.memory.used.toFixed(2)} GB used • ${metrics.memory.available.toFixed(2)} GB available • ${metrics.memory.total.toFixed(2)} GB total`} 
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
              />
            </div>
          )}
        </div>
      );
}

export default Dashboard;

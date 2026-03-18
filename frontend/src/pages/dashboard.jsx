import React, { useState, useEffect} from 'react';
import { getMetrics } from '../services/api';

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
        <div>
            {!metrics ? (
                <p>Loading...</p>
                ) : (
                <div>
                    <p>CPU Usage: {metrics.cpu.usage.toFixed(2)}%</p>
                    <p>Memory Usage: {metrics.memory.usage.toFixed(2)}%</p>
                    <p>Disk Usage: {metrics.disk[0]?.usage}%</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  import './metricChart.css';
  import React from 'react';
  
  const MetricChart = ({ title, data, dataKey, color }) => {
    return (
      <div className="metric__chart">
        <h2 className="metric__chart--title">{title}</h2>
  
        <div className="metric__chart--container">
          <ResponsiveContainer width="100%" height={263}>
            <LineChart data={data}>
              <defs>
                <filter
                  id={`glow-${dataKey}`}
                  height="200%"
                  width="200%"
                  x="-50%"
                  y="-50%"
                >
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
  
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.15)"
              />
  
              <XAxis
                dataKey="time"
                tick={{ fill: '#e2e8f0', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
  
              <YAxis
                tick={{ fill: '#e2e8f0', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
  
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                }}
              />
  
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={false}
                filter={`url(#glow-${dataKey})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default MetricChart;
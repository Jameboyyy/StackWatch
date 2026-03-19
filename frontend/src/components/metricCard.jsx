import React from 'react';
import './metricCard.css';

const MetricCard = ({ title, value, subtext, status = 'healthy' }) => {
  return (
    <div className={`metric__card metric__card--${status}`}>
      <h2 className="metric__card--title">{title}</h2>

      <div
        key={`${value}-${subtext ?? ''}`}
        className="metric__card--content metric__card--content--animated"
      >
        <p className="metric__card--value">{value}</p>
        {subtext && <p className="metric__card--subtext">{subtext}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
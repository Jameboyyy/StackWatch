import React from 'react';
import './metricCard.css';

const MetricCard = ({title, value, subtext}) => {
    return (
        <div className="metric__card">
            <h2 className="metric__card__title">{title}</h2>
            <p className="metric__card__value">{value}</p>
            {subtext && <p className="metric__card__subtext">{subtext}</p>}
        </div>
    );
};

export default MetricCard;

import express from 'express';
import cors from 'cors';
import metricsRoute from './routes/metrics.route.js';
import prometheusRoute from './routes/prometheus.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/metrics', metricsRoute);
app.use('/metrics', prometheusRoute);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
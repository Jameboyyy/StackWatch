import express from 'express';
import cors from 'cors';
import metricsRoute from './routes/metrics.route.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/metrics', metricsRoute);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
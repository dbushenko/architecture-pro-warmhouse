import express from 'express';
import deviceRoutes from './routes/deviceRoutes';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', deviceRoutes);

export default app;

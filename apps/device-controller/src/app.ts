import express from 'express';
import cors from 'cors';
import deviceRoutes from './routes/deviceRoutes';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', deviceRoutes);

export default app;

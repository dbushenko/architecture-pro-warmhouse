import app from './app';
import { config } from './config';
import { queueService } from './services/queueService';
import { startPolling } from './services/scheduler';

async function startServer() {
    await queueService.connect();

    const server = app.listen(config.port, () => {
        console.log(`Device Controller service listening on port ${config.port}`);
        
        startPolling();
    });

    const shutdown = async () => {
        console.log('Shutting down service...');
        server.close();
        await queueService.disconnect();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

startServer();

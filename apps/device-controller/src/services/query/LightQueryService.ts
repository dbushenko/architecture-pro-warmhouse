import { Request, Response } from 'express';
import { QueryService } from './QueryService';

export class LightQueryService implements QueryService {
    async handleQuery(req: Request, res: Response): Promise<void> {
        const deviceId = req.query.deviceId as string;
        
        if (!deviceId) {
            res.status(400).json({ message: 'deviceId query parameter is required.' });
            return;
        }

        res.status(200).json({
            deviceId: deviceId,
            type: 'LIGHT',
            status: 'ON', 
            brightness: 75 
        });
    }
}
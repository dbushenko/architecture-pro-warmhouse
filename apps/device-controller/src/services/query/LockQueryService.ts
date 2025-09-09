import { Request, Response } from 'express';
import { QueryService } from './QueryService';

export class LockQueryService implements QueryService {
    async handleQuery(req: Request, res: Response): Promise<void> {
        // For now, returning a mock response
        // In a real implementation, this would query the actual lock status
        const deviceId = req.query.deviceId as string;
        
        if (!deviceId) {
            res.status(400).json({ message: 'deviceId query parameter is required.' });
            return;
        }

        // Mock response for lock status
        res.status(200).json({
            deviceId: deviceId,
            type: 'LOCK',
            status: 'LOCKED' // or 'UNLOCKED'
        });
    }
}
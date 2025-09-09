import { Request, Response } from 'express';
import { CommandService } from './CommandService';

export class LockCommandService implements CommandService {
    async handleCommand(req: Request, res: Response): Promise<void> {
        const command = req.body;

        if (!command || !command.deviceId) {
            res.status(400).json({ message: 'Device ID is required in command.' });
            return;
        }

        console.log('Processing lock command:', command);
        
        res.status(200).json({ 
            message: 'Lock command processed successfully.',
            commandId: command.deviceId
        });
    }
}
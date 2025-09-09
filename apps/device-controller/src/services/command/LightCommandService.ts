import { Request, Response } from 'express';
import { CommandService } from './CommandService';

export class LightCommandService implements CommandService {
    async handleCommand(req: Request, res: Response): Promise<void> {
        const command = req.body;

        if (!command || !command.deviceId) {
            res.status(400).json({ message: 'Device ID is required in command.' });
            return;
        }

        // For now, just logging the command
        // In a real implementation, this would send the command to the actual light device
        console.log('Processing light command:', command);
        
        // Mock response
        res.status(200).json({ 
            message: 'Light command processed successfully.',
            commandId: command.deviceId
        });
    }
}
import { Request, Response } from 'express';

export interface CommandService {
    handleCommand(req: Request, res: Response): Promise<void>;
}
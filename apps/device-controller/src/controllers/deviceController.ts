import { Request, Response } from 'express';
import { ServiceFactory } from '../services/ServiceFactory';

export const handleCommand = async (req: Request, res: Response) => {
    try {
        const commandService = ServiceFactory.getCommandService(req.body);
        await commandService.handleCommand(req, res);
    } catch (error) {
        console.error('Error handling command:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Internal server error while processing command.',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};

export const handleQuery = async (req: Request, res: Response) => {
    try {
        const queryService = ServiceFactory.getQueryService(req.query);
        await queryService.handleQuery(req, res);
    } catch (error) {
        console.error('Error handling query:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Internal server error while processing query.',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};

import { Request, Response } from 'express';

export interface QueryService {
    handleQuery(req: Request, res: Response): Promise<void>;
}
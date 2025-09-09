import express from 'express';
import { handleCommand, handleQuery } from '../controllers/deviceController';

const router = express.Router();

router.post('/command', handleCommand);
router.get('/query', handleQuery);

export default router;

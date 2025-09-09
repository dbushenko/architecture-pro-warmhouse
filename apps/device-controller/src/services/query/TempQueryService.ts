import { Request, Response } from 'express';
import axios from 'axios';
import { QueryService } from './QueryService';

export class TempQueryService implements QueryService {
    async handleQuery(req: Request, res: Response): Promise<void> {
        const sensorId = req.query.sensorId as string;

        if (!sensorId) {
            res.status(400).json({ message: 'sensorId query parameter is required.' });
            return;
        }

        try {
            // Query the smart_home service for temperature data
            const smartHomeUrl = 'http://smart-home:8080'; // Assuming this is the smart_home service URL
            const smartHomeApiUrl = `${smartHomeUrl}/api/v1/sensors/${sensorId}`;
            console.log(`Querying smart_home service: ${smartHomeApiUrl}`);

            const response = await axios.get(smartHomeApiUrl);
            
            // Return the data from smart_home
            res.status(200).json(response.data);
        } catch (error) {
            // Handle errors from the smart_home service
            if (axios.isAxiosError(error)) {
                console.error(`Axios error querying smart_home service for sensor ${sensorId}:`, error.message);
                if (error.response) {
                    // If the error is from the smart_home service, forward its status and response
                    res.status(error.response.status).json({
                        message: `Error from smart_home service for sensor ${sensorId}.`,
                        error: error.response.data
                    });
                    return;
                } else {
                    // For other Axios errors (e.g., network issues), return a generic 503
                    res.status(503).json({ message: 'Service unavailable: Cannot connect to the smart_home service.' });
                    return;
                }
            } else if (error instanceof Error) {
                // Handle generic errors
                console.error(`Generic error querying smart_home service for sensor ${sensorId}:`, error.message);
            } else {
                // Handle other unknown errors
                console.error(`An unknown error occurred for sensor ${sensorId}:`, error);
            }

            // For non-Axios errors, return a generic 500
            res.status(500).json({ message: 'Internal server error while querying the smart_home service.' });
        }
    }
}
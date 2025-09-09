import axios from 'axios';
import { config } from '../config';
import { queueService } from './queueService';

async function pollAllSensors() {
    console.log('Polling all sensors except temperature sensors');
    
    try {
        // Query the smart_home service for all sensors
        const smartHomeApiUrl = `${config.smartHomeUrl}/api/v1/sensors`;
        console.log(`Querying smart_home service: ${smartHomeApiUrl}`);
        
        const response = await axios.get(smartHomeApiUrl);
        const sensors = response.data;
        
        // Filter out temperature sensors since they are already polled by legacy-adapter
        const nonTemperatureSensors = sensors.filter((sensor: any) => sensor.type !== 'temperature');
        
        console.log(`Found ${nonTemperatureSensors.length} non-temperature sensors`);
        
        // Send data for each non-temperature sensor to Kafka
        for (const sensor of nonTemperatureSensors) {
            console.log(`Sending data for sensor ${sensor.id}:`, sensor);
            await queueService.sendMessage(config.kafka.topics.sensorUpdates, sensor);
        }
    } catch (error) {
        console.error('Failed to poll sensors from smart_home service:', error);
    }
}

export function startPolling() {
    // Poll every 60 seconds
    setInterval(pollAllSensors, 60 * 1000);
    console.log('All sensors polling scheduled to run every 60 seconds.');
    
    // Run immediately on startup
    pollAllSensors();
}
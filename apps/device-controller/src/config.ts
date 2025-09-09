import dotenv from 'dotenv';

dotenv.config();

if (!process.env.KAFKA_BROKERS) {
    throw new Error("KAFKA_BROKERS environment variable is not set!");
}

export const config = {
    port: process.env.PORT || '8083',
    smartHomeUrl: process.env.SMART_HOME_URL || 'http://smart-home:8080',
    kafka: {
        brokers: process.env.KAFKA_BROKERS.split(','),
        topics: {
            temperatureCommands: 'temperature-commands',
            temperatureUpdates: 'temperature-updates',
            sensorUpdates: 'sensor-updates',
        }
    }
};

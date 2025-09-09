import { Kafka, Producer } from 'kafkajs';
import { config } from '../config';
import {
  TemperatureCommandDto,
  TemperatureUpdateDto,
  CreateSensorDto,
  UpdateSensorValueDto
} from '../dtos/sensor.dto';
import {
  LegacyOperationType,
  LegacyCommandDto,
  CreateSensorCommandDto,
  UpdateSensorCommandDto,
  PatchSensorValueCommandDto,
  DeleteSensorCommandDto
} from '../dtos/legacy-command.dto';

/**
 * Queue Service для отправки сообщений в топики:
 * 1. temperature-commands - для команд управления устройствами температуры
 * 2. temperature-updates - для обновлений данных температуры
 * 3. sensor-updates - для обновлений данных всех датчиков (кроме температурных)
 */
class QueueService {
    private producer: Producer;

    constructor() {
        const kafka = new Kafka({
            clientId: 'device-controller',
            brokers: config.kafka.brokers,
        });
        this.producer = kafka.producer();
    }

    async connect() {
        try {
            await this.producer.connect();
            console.log('Kafka producer connected successfully.');
        } catch (error) {
            console.error('Failed to connect Kafka producer:', error);
            process.exit(1);
        }
    }

    /**
     * Отправляет команду создания сенсора в топик Kafka
     * @param topic - Название топика Kafka
     * @param payload - Данные для создания сенсора
     */
    async sendCreateSensorCommand(topic: string, payload: CreateSensorDto) {
        try {
            const command: CreateSensorCommandDto = {
                operation: LegacyOperationType.CREATE,
                payload
            };
            
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(command) }],
            });
        } catch (error) {
            console.error(`Failed to send create sensor command to topic ${topic}:`, error);
        }
    }

    /**
     * Отправляет команду обновления сенсора в топик Kafka
     * @param topic - Название топика Kafka
     * @param sensorId - ID сенсора
     * @param payload - Данные для обновления сенсора
     */
    async sendUpdateSensorCommand(topic: string, sensorId: string, payload: CreateSensorDto) {
        try {
            const command: UpdateSensorCommandDto = {
                operation: LegacyOperationType.UPDATE,
                sensorId,
                payload
            };
            
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(command) }],
            });
        } catch (error) {
            console.error(`Failed to send update sensor command to topic ${topic}:`, error);
        }
    }

    /**
     * Отправляет команду обновления значения сенсора в топик Kafka
     * @param topic - Название топика Kafka
     * @param sensorId - ID сенсора
     * @param payload - Данные для обновления значения сенсора
     */
    async sendPatchSensorValueCommand(topic: string, sensorId: string, payload: UpdateSensorValueDto) {
        try {
            const command: PatchSensorValueCommandDto = {
                operation: LegacyOperationType.PATCH,
                sensorId,
                payload
            };
            
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(command) }],
            });
        } catch (error) {
            console.error(`Failed to send patch sensor value command to topic ${topic}:`, error);
        }
    }

    /**
     * Отправляет команду удаления сенсора в топик Kafka
     * @param topic - Название топика Kafka
     * @param sensorId - ID сенсора
     */
    async sendDeleteSensorCommand(topic: string, sensorId: string) {
        try {
            const command: DeleteSensorCommandDto = {
                operation: LegacyOperationType.DELETE,
                sensorId
            };
            
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(command) }],
            });
        } catch (error) {
            console.error(`Failed to send delete sensor command to topic ${topic}:`, error);
        }
    }

    /**
     * Отправляет команду температуры в топик Kafka
     * @param topic - Название топика Kafka
     * @param message - Команда температуры
     */
    async sendTemperatureCommand(topic: string, message: TemperatureCommandDto) {
        try {
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        } catch (error) {
            console.error(`Failed to send temperature command to topic ${topic}:`, error);
        }
    }

    /**
     * Отправляет обновление температуры в топик Kafka
     * @param topic - Название топика Kafka
     * @param message - Обновление температуры
     */
    async sendTemperatureUpdate(topic: string, message: TemperatureUpdateDto) {
        try {
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        } catch (error) {
            console.error(`Failed to send temperature update to topic ${topic}:`, error);
        }
    }

    /**
     * Отправляет сообщение в указанный топик Kafka
     * @param topic - Название топика Kafka
     * @param message - Сообщение для отправки
     */
    async sendMessage(topic: string, message: any) {
        try {
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        } catch (error) {
            console.error(`Failed to send message to topic ${topic}:`, error);
        }
    }

    async disconnect() {
        await this.producer.disconnect();
        console.log('Queue service disconnected.');
    }
}

export const queueService = new QueueService();

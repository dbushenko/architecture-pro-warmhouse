import { Request, Response } from 'express';
import { CommandService } from './CommandService';
import { queueService } from '../queueService';
import { config } from '../../config';
import { TemperatureCommandDto } from '../../dtos/sensor.dto';
import {
  CreateSensorDto,
  UpdateSensorValueDto
} from '../../dtos/sensor.dto';

export class TempCommandService implements CommandService {
    async handleCommand(req: Request, res: Response): Promise<void> {
        const command: any = req.body;

        if (!command || !command.deviceId) {
            res.status(400).json({ message: 'Device ID is required in command.' });
            return;
        }

        try {
            // Определяем тип операции на основе содержимого команды
            if (command.hasOwnProperty('value') && command.hasOwnProperty('status')) {
                // PATCH операция - обновление значения сенсора
                const payload: UpdateSensorValueDto = {
                    value: command.value,
                    status: command.status
                };
                
                await queueService.sendPatchSensorValueCommand(
                    config.kafka.topics.temperatureCommands,
                    command.deviceId,
                    payload
                );
            } else {
                // Отправляем как обычную температурную команду
                const tempCommand: TemperatureCommandDto = {
                    deviceId: command.deviceId,
                    command: command.command,
                    targetTemperature: command.targetTemperature,
                    timestamp: command.timestamp
                };
                
                await queueService.sendTemperatureCommand(
                    config.kafka.topics.temperatureCommands,
                    tempCommand
                );
            }
            
            res.status(202).json({
                message: 'Temperature command accepted and is being processed.',
                commandId: command.deviceId
            });
        } catch (error) {
            console.error('Error sending temperature command to Kafka:', error);
            res.status(500).json({
                message: 'Failed to process temperature command.',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
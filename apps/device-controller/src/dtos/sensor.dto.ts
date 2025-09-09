/**
 * DTO для создания нового сенсора
 * Соответствует структуре из Postman коллекции
 */
export interface CreateSensorDto {
  name: string;
  type: string;
  location: string;
  unit: string;
}

/**
 * DTO для обновления значения сенсора
 * Соответствует структуре из Postman коллекции
 */
export interface UpdateSensorValueDto {
  value: number;
  status: string;
}

/**
 * DTO для команды управления температурой
 */
export interface TemperatureCommandDto {
  deviceId: string;
  command?: string;
  targetTemperature?: number;
  timestamp?: string;
}

/**
 * DTO для обновления данных температуры
 */
export interface TemperatureUpdateDto {
  id: number;
  name: string;
  type: string;
  location: string;
  value: number;
  unit: string;
  status: string;
  last_updated: string;
  created_at: string;
}
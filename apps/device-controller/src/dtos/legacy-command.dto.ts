/**
 * Типы операций для legacy adapter
 */
export enum LegacyOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * Базовый интерфейс для команд legacy adapter
 */
export interface LegacyCommandDto {
  operation: LegacyOperationType;
  sensorId?: string; // ID сенсора (для UPDATE, PATCH, DELETE)
  payload?: any; // Данные для операции
}

/**
 * DTO для создания нового сенсора
 */
export interface CreateSensorCommandDto extends LegacyCommandDto {
  operation: LegacyOperationType.CREATE;
  payload: {
    name: string;
    type: string;
    location: string;
    unit: string;
  };
}

/**
 * DTO для обновления сенсора
 */
export interface UpdateSensorCommandDto extends LegacyCommandDto {
  operation: LegacyOperationType.UPDATE;
  sensorId: string;
  payload: {
    name: string;
    type: string;
    location: string;
    unit: string;
  };
}

/**
 * DTO для обновления значения сенсора
 */
export interface PatchSensorValueCommandDto extends LegacyCommandDto {
  operation: LegacyOperationType.PATCH;
  sensorId: string;
  payload: {
    value: number;
    status: string;
  };
}

/**
 * DTO для удаления сенсора
 */
export interface DeleteSensorCommandDto extends LegacyCommandDto {
  operation: LegacyOperationType.DELETE;
  sensorId: string;
}
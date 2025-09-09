import { QueryService } from './query/QueryService';
import { CommandService } from './command/CommandService';
import { TempQueryService } from './query/TempQueryService';
import { LightQueryService } from './query/LightQueryService';
import { LockQueryService } from './query/LockQueryService';
import { TempCommandService } from './command/TempCommandService';
import { LightCommandService } from './command/LightCommandService';
import { LockCommandService } from './command/LockCommandService';

export class ServiceFactory {
    static getQueryService(queryParams: any): QueryService {
        if (queryParams.type === 'temp') {
            return new TempQueryService();
        }
        
        if (queryParams.type === 'light') {
            return new LightQueryService();
        }
        
        if (queryParams.type === 'lock') {
            return new LockQueryService();
        }
        
        return new TempQueryService();
    }
    
    static getCommandService(commandBody: any): CommandService {
        if (commandBody.deviceId && commandBody.type === 'temp') {
            return new TempCommandService();
        }
        
        if (commandBody.deviceId && commandBody.type === 'light') {
            return new LightCommandService();
        }
        
        if (commandBody.deviceId && commandBody.type === 'lock') {
            return new LockCommandService();
        }
        
        return new TempCommandService();
    }
}
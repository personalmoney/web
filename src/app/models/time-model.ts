import { BaseModel } from './base-model';

export interface TimeModel extends BaseModel {
    created_time?: Date;
    updated_time?: Date;
    local_updated_time?: Date;
}

import { TimeModel } from 'src/app/models/time-model';

export interface SubCategory extends TimeModel {
    name: string;
    category_id?: number;
    category_name?: string;
    local_category_id?: number;
}

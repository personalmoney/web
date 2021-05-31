import { TimeModel } from 'src/app/models/time-model';

export interface SubCategory extends TimeModel {
    name: string;
    categoryId?: number;
    categoryName?: string;
    localCategoryId?: number;
}


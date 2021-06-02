import { TimeModel } from 'src/app/models/time-model';
import { SubCategory } from './sub-category';

export interface Category extends TimeModel {
    name: string;
    sub_categories: SubCategory[];
}

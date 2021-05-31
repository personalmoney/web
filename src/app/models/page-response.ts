import { PageRequest } from './page-request';

export interface PageResponse<T> extends PageRequest {
    totalRecords: number;
    records: T[];
}

import { TimeModel } from 'src/app/models/time-model';

export interface Transaction extends TimeModel {
    payeeId?: number;
    payeeLocalId?: number;
    subCategoryId?: number;
    subCategoryLocalId?: number;
    amount: number;
    date: Date;
    accountId?: number;
    accountLocalId?: number;
    toAccountId?: number;
    toAccountLocalId?: number;
    notes?: string;
    tagIds?: string[];
    tagIdsLocal?: number[];
    type: number;
}

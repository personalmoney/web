import { PageRequest } from 'src/app/models/page-request';

export class TransactionFilter extends PageRequest {
    accountIds?: number[];
    transactionTypes?: string[];
    fromAmount?: number;
    toAmount?: number;
    fromDate?: Date;
    toDate?: Date;
    payeeIds?: number[];
    subCategoryIds?: number[];
    notes?: string;
}
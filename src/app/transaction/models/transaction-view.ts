import { Tag } from 'src/app/entities/tags/models/tag';
import { Transaction } from './transaction';

export interface TransactionView extends Transaction {
    accountName: string;
    toAccountName: string;
    payeeName: string;
    categoryName: string;
    subCategoryName: string;
    balance: number;
    tags: Tag[];
}

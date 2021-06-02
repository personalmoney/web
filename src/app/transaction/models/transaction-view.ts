import { Tag } from 'src/app/entities/tags/models/tag';
import { Transaction } from './transaction';

export interface TransactionView extends Transaction {
    account_name: string;
    to_account_name: string;
    payee_name: string;
    category_name: string;
    sub_category_name: string;
    balance: number;
    tags: Tag[];
}

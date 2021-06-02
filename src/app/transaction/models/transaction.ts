import { TimeModel } from 'src/app/models/time-model';

export interface Transaction extends TimeModel {
    payee_id?: number;
    payee_local_id?: number;
    sub_category_id?: number;
    sub_category_local_id?: number;
    amount: number;
    trans_date: Date;
    account_id?: number;
    account_local_id?: number;
    to_account_id?: number;
    to_account_local_id?: number;
    notes?: string;
    tag_ids?: string[];
    tag_ids_local?: number[];
    trans_type: string;
}

import { TimeModel } from 'src/app/models/time-model';

export interface Account extends TimeModel {
    name: string;
    account_type_id: number;
    account_type_local_id?: number;
    initial_balance?: number;
    minimum_balance?: number;
    credit_limit?: number;
    payment_date?: Date;
    interest_rate?: number;
    include_in_balance: boolean;
    exclude_from_dashboard?: boolean | string;
    notes?: string;
    balance?: number;
    is_active?: boolean;
}

import { TimeModel } from 'src/app/models/time-model';

export interface Account extends TimeModel {
    name: string;
    accountTypeId: number;
    accountTypeLocalId?: number;
    initialBalance?: number;
    minimumBalance?: number;
    creditLimit?: number;
    paymentDate?: Date;
    interestRate?: number;
    includeInBalance: boolean;
    excludeFromDashboard?: boolean | string;
    notes?: string;
    balance?: number;
    isActive?: boolean;
}

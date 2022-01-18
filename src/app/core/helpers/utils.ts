
export class Utils {

    static getTime(): Date {
        return new Date(new Date().toISOString());
    }
}

export enum TransactionType {
    Withdraw = 'Withdraw',
    Deposit = 'Deposit',
    Transfer = 'Transfer'
}

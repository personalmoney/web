import { AccountType } from '../models/account-type';

export class AddAccountType {
    static readonly type = '[AccountType] Add';

    constructor(public payload: AccountType) {
    }
}

export class GetAccountTypes {
    static readonly type = '[AccountType] Get';
}

export class UpdateAccountType {
    static readonly type = '[AccountType] Update';

    constructor(public payload: AccountType) {
    }
}

export class DeleteAccountType {
    static readonly type = '[AccountType] Delete';

    constructor(public payload: AccountType) {
    }
}

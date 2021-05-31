import { Account } from '../models/account';

export class AddAccount {
    static readonly type = '[Account] Add';

    constructor(public payload: Account) {
    }
}

export class GetAccounts {
    static readonly type = '[Account] Get';
}

export class UpdateAccount {
    static readonly type = '[Account] Update';

    constructor(public payload: Account) {
    }
}

export class DeleteAccount {
    static readonly type = '[Account] Delete';

    constructor(public payload: Account) {
    }
}

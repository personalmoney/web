import { Payee } from '../models/payee';

export class AddPayee {
    static readonly type = '[Payee] Add';

    constructor(public payload: Payee) {
    }
}

export class GetPayees {
    static readonly type = '[Payee] Get';
}

export class UpdatePayee {
    static readonly type = '[Payee] Update';

    constructor(public payload: Payee) {
    }
}

export class DeletePayee {
    static readonly type = '[Payee] Delete';

    constructor(public payload: Payee) {
    }
}

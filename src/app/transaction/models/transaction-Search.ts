import { PageRequest } from 'src/app/models/page-request';

export interface TransactionSearch extends PageRequest {
    account_id?: number;
}

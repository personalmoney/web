import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Account } from '../models/account';
import { AccountService } from '../service/account.service';
import { Injectable } from '@angular/core';
import { AddAccount, GetAccounts, UpdateAccount, DeleteAccount } from './actions';

export class AccountStateModel {
    data: Account[];
}

@State<Account[]>({
    name: 'accounts',
    defaults: []
})
@Injectable()
export class AccountState {
    constructor(private service: AccountService) {
    }

    @Selector()
    static getData(state: AccountStateModel) {
        return state.data;
    }

    @Selector()
    static getSortedData(state: AccountStateModel) {
        if (state.data) {
            return [...state.data].sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        return state.data;
    }

    @Action(GetAccounts)
    get({ getState, setState }: StateContext<AccountStateModel>) {

        return this.service.getAll().then((result) => {
            const state = getState();
            setState({
                ...state,
                data: result,
            });
        });
    }

    @Action(AddAccount)
    add({ getState, patchState }: StateContext<AccountStateModel>, { payload }: AddAccount) {
        return this.service.create(payload).then((result) => {
            const state = getState();
            patchState({
                data: [...state.data, result]
            });
        });
    }

    @Action(UpdateAccount)
    update({ getState, setState }: StateContext<AccountStateModel>, { payload }: UpdateAccount) {
        return this.service.update(payload).then((result) => {
            const state = getState();
            const dataList = [...state.data];
            const dataIndex = dataList.findIndex(item => payload.local_id ? (item.local_id === payload.local_id) : (item.id === payload.id));
            dataList[dataIndex] = result;
            setState({
                ...state,
                data: dataList,
            });
        });
    }


    @Action(DeleteAccount)
    delete({ getState, setState }: StateContext<AccountStateModel>, { payload }: DeleteAccount) {
        return this.service.delete(payload).then(() => {
            const state = getState();
            let filteredArray;
            if (payload.id) {
                filteredArray = state.data.filter(item => item.id !== payload.id);
            }
            else {
                filteredArray = state.data.filter(item => item.local_id !== payload.local_id);
            }
            setState({
                ...state,
                data: filteredArray,
            });
        });
    }
}

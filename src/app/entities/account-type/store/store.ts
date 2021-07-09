import { State, Selector, Action, StateContext } from '@ngxs/store';
import { AccountType } from '../models/account-type';
import { AccountTypeService } from '../service/account-type.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AddAccountType, GetAccountTypes, UpdateAccountType, DeleteAccountType } from './actions';
import { from } from 'rxjs';

export class AccountTypeStateModel {
    data: AccountType[];
}

@State<AccountType[]>({
    name: 'accountTypes',
    defaults: []
})
@Injectable()
export class AccountTypeState {
    constructor(
        private service: AccountTypeService
    ) {
    }

    @Selector()
    static getData(state: AccountTypeStateModel) {
        return state.data;
    }

    @Selector()
    static getSortedData(state: AccountTypeStateModel) {
        if (state.data) {
            return [...state.data].sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        return state.data;
    }

    @Action(GetAccountTypes)
    async get({ getState, setState }: StateContext<AccountTypeStateModel>) {
        const result = await this.service.getAll();
        const state = getState();
        setState({
            ...state,
            data: result,
        });
    }


    @Action(AddAccountType)
    add({ getState, patchState }: StateContext<AccountTypeStateModel>, { payload }: AddAccountType) {
        return this.service.create(payload)
            .then(result => {
                const state = getState();
                patchState({
                    data: [...state.data, result]
                });
            });
    }

    @Action(UpdateAccountType)
    update({ getState, setState }: StateContext<AccountTypeStateModel>, { payload }: UpdateAccountType) {
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

    @Action(DeleteAccountType)
    delete({ getState, setState }: StateContext<AccountTypeStateModel>, { payload }: DeleteAccountType) {
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

import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Payee } from '../models/payee';
import { PayeeService } from '../service/payee.service';
import { Injectable } from '@angular/core';
import { AddPayee, GetPayees, UpdatePayee, DeletePayee } from './actions';

export class PayeeStateModel {
    data: Payee[];
}

@State<Payee[]>({
    name: 'payees',
    defaults: []
})
@Injectable()
export class PayeeState {
    constructor(private service: PayeeService) {
    }

    @Selector()
    static getData(state: PayeeStateModel) {
        return state.data;
    }

    @Selector()
    static getSortedData(state: PayeeStateModel) {
        if (state.data) {
            return [...state.data].sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        return state.data;
    }

    @Action(GetPayees)
    get({ getState, setState }: StateContext<PayeeStateModel>) {

        return this.service.getAll().then((result) => {
            const state = getState();
            setState({
                ...state,
                data: result,
            });
        });
    }

    @Action(AddPayee)
    add({ getState, patchState }: StateContext<PayeeStateModel>, { payload }: AddPayee) {
        return this.service.create(payload).then((result) => {
            const state = getState();
            patchState({
                data: [...state.data, result]
            });
        });
    }

    @Action(UpdatePayee)
    update({ getState, setState }: StateContext<PayeeStateModel>, { payload }: UpdatePayee) {
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


    @Action(DeletePayee)
    delete({ getState, setState }: StateContext<PayeeStateModel>, { payload }: DeletePayee) {
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

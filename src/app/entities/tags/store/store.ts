import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Tag } from '../models/tag';
import { TagService } from '../service/tag.service';
import { Injectable } from '@angular/core';
import { AddTag, GetTags, UpdateTag, DeleteTag } from './actions';

export class TagStateModel {
    data: Tag[];
}

@State<Tag[]>({
    name: 'tags',
    defaults: []
})
@Injectable()
export class TagState {
    constructor(private service: TagService) {
    }

    @Selector()
    static getData(state: TagStateModel) {
        return state.data;
    }

    @Selector()
    static getSortedData(state: TagStateModel) {
        if (state.data) {
            return [...state.data].sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        return state.data;
    }

    @Action(GetTags)
    get({ getState, setState }: StateContext<TagStateModel>) {

        return this.service.getAll().then((result) => {
            const state = getState();
            setState({
                ...state,
                data: result,
            });
        });
    }

    @Action(AddTag)
    add({ getState, patchState }: StateContext<TagStateModel>, { payload }: AddTag) {
        return this.service.create(payload).then((result) => {
            const state = getState();
            patchState({
                data: [...state.data, result]
            });
        });
    }

    @Action(UpdateTag)
    update({ getState, setState }: StateContext<TagStateModel>, { payload }: UpdateTag) {
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


    @Action(DeleteTag)
    delete({ getState, setState }: StateContext<TagStateModel>, { payload }: DeleteTag) {
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

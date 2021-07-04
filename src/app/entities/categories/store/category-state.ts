import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Category } from '../models/category';
import { CategoryService } from '../service/category.service';
import { Injectable } from '@angular/core';
import {
    AddCategory, GetCategories, UpdateCategory, DeleteCategory, DeleteSubCategory, UpdateSubCategory, AddSubCategory
} from './actions';
import { SubCategory } from '../models/sub-category';
import { SubCategoryService } from '../service/sub-category.service';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';

export class CategoryStateModel {
    data: Category[];
}

@State<Category[]>({
    name: 'categories',
    defaults: []
})
@Injectable()
export class CategoryState {
    constructor(private service: CategoryService, private subCategoryService: SubCategoryService) {
    }

    @Selector()
    static getData(state: CategoryStateModel) {
        return state.data;
    }

    @Selector()
    static getSortedData(state: CategoryStateModel) {
        if (state.data) {
            return [...state.data].sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
        return state.data;
    }

    @Action(GetCategories)
    get({ getState, setState }: StateContext<CategoryStateModel>) {

        return this.service.getAll().then((result) => {
            const state = getState();
            setState({
                ...state,
                data: result,
            });
        });
    }

    @Action(AddCategory)
    add({ getState, patchState }: StateContext<CategoryStateModel>, { payload }: AddCategory) {
        return this.service.create(payload).then((result) => {
            const state = getState();
            patchState({
                data: [...state.data, result]
            });
        });
    }

    @Action(UpdateCategory)
    update({ getState, setState }: StateContext<CategoryStateModel>, { payload }: UpdateCategory) {
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


    @Action(DeleteCategory)
    delete({ getState, setState }: StateContext<CategoryStateModel>, { payload }: DeleteCategory) {
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

    @Action(AddSubCategory)
    @ImmutableContext()
    addSubCategory({ getState, setState }: StateContext<CategoryStateModel>, { payload }: AddSubCategory) {
        return this.subCategoryService.create(payload).then((result) => {
            const state = getState();
            const { index } = this.getCategory(state, payload);
            setState((state: CategoryStateModel) => {
                if (!state.data[index].sub_categories) {
                    state.data[index].sub_categories = [];
                }
                state.data[index].sub_categories.push(result);
                return state;
            });
        });
    }

    @Action(UpdateSubCategory)
    @ImmutableContext()
    updateSubCategory({ getState, setState }: StateContext<CategoryStateModel>, { payload }: UpdateSubCategory) {
        return this.subCategoryService.update(payload).then((result) => {
            const state = getState();
            const { category, index } = this.getCategory(state, payload);
            const dataIndex = category.sub_categories.findIndex(item => payload.local_id
                ? (item.local_id === payload.local_id) : (item.id === payload.id));
            setState((state: CategoryStateModel) => {
                state.data[index].sub_categories[dataIndex] = result;
                return state;
            });
        });
    }

    @Action(DeleteSubCategory)
    @ImmutableContext()
    deleteSubCategory({ getState, setState }: StateContext<CategoryStateModel>, { payload }: DeleteSubCategory) {
        return this.subCategoryService.delete(payload).then(() => {
            const state = getState();
            const { category, index } = this.getCategory(state, payload);
            let filteredArray;
            if (payload.id) {
                filteredArray = category.sub_categories.filter(item => item.id !== payload.id);
            }
            else {
                filteredArray = category.sub_categories.filter(item => item.local_id !== payload.local_id);
            }
            state.data[index].sub_categories = filteredArray;

            setState(s => state);
        });
    }

    private getCategory(state: CategoryStateModel, payload: SubCategory) {
        const dataList = [...state.data];
        const index = dataList.findIndex(item => payload.local_category_id
            ? (item.local_id === payload.local_category_id) : (item.id === payload.category_id));
        const category = dataList[index];
        return { category, index };
    }
}

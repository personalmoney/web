import { Category } from '../models/category';
import { SubCategory } from '../models/sub-category';

export class AddCategory {
    static readonly type = '[Category] Add';

    constructor(public payload: Category) {
    }
}

export class AddSubCategory {
    static readonly type = '[SubCategory] Add';

    constructor(public payload: SubCategory) {
    }
}

export class GetCategories {
    static readonly type = '[Category] Get';
}

export class GetSubCategories {
    static readonly type = '[SubCategory] Get';
    constructor(public categoryId: string) {
    }
}

export class UpdateCategory {
    static readonly type = '[Category] Update';

    constructor(public payload: Category) {
    }
}

export class UpdateSubCategory {
    static readonly type = '[SubCategory] Update';

    constructor(public payload: SubCategory) {
    }
}

export class DeleteCategory {
    static readonly type = '[Category] Delete';

    constructor(public payload: Category) {
    }
}

export class DeleteSubCategory {
    static readonly type = '[SubCategory] Delete';

    constructor(public payload: SubCategory) {
    }
}

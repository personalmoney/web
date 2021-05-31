import { Tag } from '../models/tag';

export class AddTag {
    static readonly type = '[Tag] Add';

    constructor(public payload: Tag) {
    }
}

export class GetTags {
    static readonly type = '[Tag] Get';
}

export class UpdateTag {
    static readonly type = '[Tag] Update';

    constructor(public payload: Tag) {
    }
}

export class DeleteTag {
    static readonly type = '[Tag] Delete';

    constructor(public payload: Tag) {
    }
}

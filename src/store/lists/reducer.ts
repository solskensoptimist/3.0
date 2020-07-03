import {listsActionTypes} from './actions';

interface ListsState {
    lists: Array<object> | null,
    listsArchived: Array<object> | null,
}

const initialState: ListsState = {
    lists: null,
    listsArchived: null,
};

export const listsReducer = (state = initialState, action) => {
    switch(action.type) {
        case listsActionTypes.SET_LISTS: {
            return {
                ...state,
                lists: action.payload,
            }
        }
        case listsActionTypes.SET_LISTS_ARCHIVED: {
            return {
                ...state,
                listsArchived: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

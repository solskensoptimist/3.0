import {listsActionTypes} from './actions';

interface ListsState {
    lists: Array<object> | null,
    listsArchived: Array<object> | null,
    listsSubscriptions: Array<object> | null,
}

const initialState: ListsState = {
    lists: null,
    listsArchived: null,
    listsSubscriptions: null,
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
        case listsActionTypes.SET_LISTS_SUBSCRIPTIONS: {
            return {
                ...state,
                listsSubscriptions: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

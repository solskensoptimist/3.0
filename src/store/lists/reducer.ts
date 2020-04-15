import {listsActionTypes} from './actions';

interface ListsState {
    lists: Array<object> | null,
}

const initialState: ListsState = {
    lists: null,
};

export const listsReducer = (state = initialState, action) => {
    switch(action.type) {
        case listsActionTypes.SET_LISTS: {
            return {
                ...state,
                lists: action.payload.lists,
            }
        }
        default: {
            return state;
        }
    }
};

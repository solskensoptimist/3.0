import {searchActionTypes} from './actions';

interface SearchState {
    showSearch: boolean,
}

const initialState: SearchState = {
    showSearch: false,
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case searchActionTypes.SET_SHOW_SEARCH: {
            return {
                ...state,
                showSearch: action.payload.showSearch,
            }
        }
        default: {
            return state;
        }
    }
};

import {searchActionTypes} from './actions';

interface SearchState {
    searchSuggestions: Array<object>,
}

const initialState: SearchState = {
    searchSuggestions: [],
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case searchActionTypes.SET_SEARCH_SUGGESTIONS: {
            return {
                ...state,
                searchSuggestions: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

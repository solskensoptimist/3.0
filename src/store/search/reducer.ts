import {searchActionTypes} from './actions';

interface SearchState {
    searchSuggestions: Array<object>,
    selected: Array<object>,
}

const initialState: SearchState = {
    searchSuggestions: [],
    selected: [],
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case searchActionTypes.SET_SEARCH_SUGGESTIONS: {
            return {
                ...state,
                searchSuggestions: action.payload,
            }
        }
        case searchActionTypes.SET_SELECTED: {
            return {
                ...state,
                selected: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

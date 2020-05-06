import {searchActionTypes} from './actions';

interface SearchState {
    searchSuggestions: Array<object>,
    selectedAll: Array<string>,
    selectedContacts: Array<string>,
}

const initialState: SearchState = {
    searchSuggestions: [],
    selectedAll: [],
    selectedContacts: [],
};

export const searchReducer = (state = initialState, action) => {
    switch(action.type) {
        case searchActionTypes.SET_SEARCH_SUGGESTIONS: {
            return {
                ...state,
                searchSuggestions: action.payload,
            }
        }
        case searchActionTypes.SET_SELECTED_ALL: {
            return {
                ...state,
                selectedAll: action.payload,
            }
        }
        case searchActionTypes.SET_SELECTED_CONTACTS: {
            return {
                ...state,
                selectedContacts: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

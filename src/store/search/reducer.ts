import {searchActionTypes} from './actions';

interface SearchState {
    searchSuggestions: Array<object>,
    selectedAll: Array<object>, // Holds selected prospects (private person user ids or org numbers)
    selectedCars: Array<object>, // Holds selected car reg numbers.
    selectedContacts: Array<object>, // Holds selected footer_contact objects.
    selectedKoncernCompanies: Array<object>, // Holds selected koncern companies (org numbers).
}

const initialState: SearchState = {
    searchSuggestions: [],
    selectedAll: [],
    selectedCars: [],
    selectedContacts: [],
    selectedKoncernCompanies: [],
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
        case searchActionTypes.SET_SELECTED_CARS: {
            return {
                ...state,
                selectedCars: action.payload,
            }
        }
        case searchActionTypes.SET_SELECTED_CONTACTS: {
            return {
                ...state,
                selectedContacts: action.payload,
            }
        }
        case searchActionTypes.SET_SELECTED_KONCERN_COMPANIES: {
            return {
                ...state,
                selectedKoncernCompanies: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

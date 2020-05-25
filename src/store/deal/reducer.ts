import {dealActionTypes} from './actions';

interface EventsState {
    deal: object | null, // The deal object that is currently in scope (this is a direct copy from db and shouldn't be tampered with, hence the extra properties in this store).
    listName: string | null, // Name of list deal originate from.
    prospectInfo: Array<object> | null, // Extra info about prospects in deal.
}

const initialState: EventsState = {
    deal: null,
    listName: null,
    prospectInfo: null,
};

export const dealReducer = (state = initialState, action) => {
    switch(action.type) {
        case dealActionTypes.SET_DEAL: {
            return {
                ...state,
                deal: action.payload,
            }
        }
        case dealActionTypes.SET_LIST_NAME: {
            return {
                ...state,
                listName: action.payload,
            }
        }
        case dealActionTypes.SET_PROSPECT_INFO: {
            return {
                ...state,
                prospectInfo: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

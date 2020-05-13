import {dealActionTypes} from './actions';

interface EventsState {
    deal: object | null, // The real deal object, this is what we send to backend when update.
    listName: string | null, // Name of list deal originate from.
    prospectInfo: Array<object> | null, // Extra info about prospects in deal.
    updatingDeal: boolean,
}

const initialState: EventsState = {
    deal: null,
    listName: null,
    prospectInfo: null,
    updatingDeal: false,
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
        case dealActionTypes.SET_UPDATING_DEAL: {
            return {
                ...state,
                updatingDeal: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

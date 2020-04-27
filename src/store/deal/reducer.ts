import {dealActionTypes} from './actions';

interface EventsState {
    deal: object | null,
    listOrigin: string | null,
}

const initialState: EventsState = {
    deal: null,
    listOrigin: null
};

export const dealReducer = (state = initialState, action) => {
    switch(action.type) {
        case dealActionTypes.SET_DEAL: {
            return {
                ...state,
                deal: action.payload,
            }
        }
        case dealActionTypes.SET_LIST_ORIGIN: {
            return {
                ...state,
                listOrigin: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

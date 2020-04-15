import {dealActionTypes} from './actions';

interface EventsState {
    deal: object | null,
}

const initialState: EventsState = {
    deal: null,
};

export const dealReducer = (state = initialState, action) => {
    switch(action.type) {
        case dealActionTypes.SET_DEAL: {
            return {
                ...state,
                deal: action.payload.deal,
            }
        }
        default: {
            return state;
        }
    }
};

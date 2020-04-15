import {filterActionTypes} from './actions';

interface EventsState {
    date: object | null,
}

const initialState: EventsState = {
    date: null,
};

export const filterReducer = (state = initialState, action) => {
    switch(action.type) {
        case filterActionTypes.SET_DATE: {
            return {
                ...state,
                date: action.payload.date,
            }
        }
        default: {
            return state;
        }
    }
};

import {eventsActionTypes} from './actions';

interface EventsState {
    events: Array<object> | null,
    month: object | null
}

const initialState: EventsState = {
    events: null,
    month: null,
};

export const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case eventsActionTypes.SET_EVENTS: {
            return {
                ...state,
                events: action.payload.events,
                month: action.payload.month,
            }
        }
        default: {
            return state;
        }
    }
};

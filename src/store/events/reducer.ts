import {eventsActionTypes} from './actions';

interface EventsState {
    events: Array<object> | null,
    month: object | null,
    monthInScope: number | null,
    yearInScope: number | null,
}

const initialState: EventsState = {
    events: null,
    month: null,
    monthInScope: null,
    yearInScope: null,
};

export const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case eventsActionTypes.SET_EVENTS: {
            return {
                ...state,
                events: action.payload.events,
                month: action.payload.month,
                monthInScope: action.payload.monthInScope,
                yearInScope: action.payload.yearInScope,
            }
        }
        default: {
            return state;
        }
    }
};

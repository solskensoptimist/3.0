import {eventsActionTypes} from './actions';

interface EventsState {
    eventsCalendar: {           // Holds events by month.
        month: object | null,
        monthInScope: number | null,
        yearInScope: number | null,
    },
    eventsFlow: Array<object>,  // Holds all events.
}

const initialState: EventsState = {
    eventsCalendar: {
        month: null,
        monthInScope: null,
        yearInScope: null,
    },
    eventsFlow: [],
};

export const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case eventsActionTypes.SET_EVENTS_CALENDAR: {
            return {
                ...state,
                eventsCalendar: action.payload,
            }
        }
        case eventsActionTypes.SET_EVENTS_FLOW: {
            return {
                ...state,
                eventsFlow: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

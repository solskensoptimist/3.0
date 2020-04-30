import {eventsActionTypes} from './actions';

interface EventsState {
    events: Array<object> | null,
    eventsByMonth: {
        month: object | null,
        monthInScope: number | null,
        yearInScope: number | null,
    },
    lastSearch: object | null,
}

const initialState: EventsState = {
    events: null,
    eventsByMonth: {
        month: null,
        monthInScope: null,
        yearInScope: null,
    },
    lastSearch: null
};

export const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case eventsActionTypes.SET_EVENTS: {
            return {
                ...state,
                events: action.payload.events,
                eventsByMonth: {
                    month: action.payload.eventsByMonth.month,
                    monthInScope: action.payload.eventsByMonth.monthInScope,
                    yearInScope: action.payload.eventsByMonth.yearInScope,
                }
            }
        }
        case eventsActionTypes.SET_LAST_SEARCH: {
            return {
                ...state,
                lastSearch: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

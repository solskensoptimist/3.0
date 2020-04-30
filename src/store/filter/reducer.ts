import {filterActionTypes} from './actions';
import moment from 'moment';

interface EventsState {
    date: {
        from: Date,
        to: Date,
    },
    leads: boolean,
    lists: Array<object> | null,
    users: Array<number> | null,
}

const initialState: EventsState = {
    date: {
        from:  moment(new Date().setHours(23,59,59,0)).subtract(1, 'month').toDate(),
        to: moment(new Date().setHours(23,59,59,0)).toDate(),
    },
    leads: false,
    lists: null,
    users: null,
};

export const filterReducer = (state = initialState, action) => {
    switch(action.type) {
        case filterActionTypes.CLEAR_FILTERS: {
            return initialState;
        }
        case filterActionTypes.SET_DATE: {
            return {
                ...state,
                date: action.payload.date,
            }
        }
        case filterActionTypes.SET_LEADS: {
            return {
                ...state,
                date: action.payload.leads,
            }
        }
        case filterActionTypes.SET_LISTS: {
            return {
                ...state,
                date: action.payload.lists,
            }
        }
        case filterActionTypes.SET_USERS: {
            return {
                ...state,
                users: action.payload.users,
            }
        }
        default: {
            return state;
        }
    }
};

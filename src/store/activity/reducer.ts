import {activityActionTypes} from './actions';

interface ActivityState {
    activityByFilter: Array<object> | null,
    activityByTarget: Array<object> | null,
    lastSearch: object | null,
}

const initialState: ActivityState = {
    activityByFilter: null,
    activityByTarget: null,
    lastSearch: null,
};

export const activityReducer = (state = initialState, action) => {
    switch(action.type) {
        case activityActionTypes.SET_ACTIVITY_BY_FILTER: {
            return {
                ...state,
                activityByFilter: action.payload,
            }
        }
        case activityActionTypes.SET_ACTIVITY_BY_TARGET: {
            return {
                ...state,
                activityByTarget: action.payload,
            }
        }
        case activityActionTypes.SET_LAST_SEARCH: {
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

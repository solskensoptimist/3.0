import {activityActionTypes} from './actions';

interface EventsState {
    activityByFilter: object | null,
    activityByTarget: {
        data: Array<object> | null,
        id: number | null,
    },
}

const initialState: EventsState = {
    activityByFilter: null,
    activityByTarget: {
        data: null,
        id: null,
    },
};

export const activityReducer = (state = initialState, action) => {
    switch(action.type) {
        case activityActionTypes.SET_ACTIVITY_BY_FILTER: {
            return {
                ...state,
                activityByFilter: action.payload.activityByFilter,
            }
        }
        case activityActionTypes.SET_ACTIVITY_BY_TARGET: {
            return {
                ...state,
                activityByTarget: action.payload.activityByTarget,
            }
        }
        default: {
            return state;
        }
    }
};

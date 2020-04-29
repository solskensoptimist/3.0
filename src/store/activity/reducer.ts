import {activityActionTypes} from './actions';

interface EventsState {
    activityByFilter: Array<object> | null,
    activityByTarget: {
        activities: Array<object> | null,
        target: string | null,
    },
}

const initialState: EventsState = {
    activityByFilter: null,
    activityByTarget: {
        activities: null,
        target: null,
    },
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
                activityByTarget: {
                    activities: action.payload.activities,
                    target: action.payload.target,
                },
            }
        }
        default: {
            return state;
        }
    }
};

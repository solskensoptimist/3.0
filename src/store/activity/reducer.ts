import {activityActionTypes} from './actions';

interface EventsState {
    activityFiltered: object | null, // oklart
}

const initialState: EventsState = {
    activityFiltered: {}, // oklart
};

export const activityReducer = (state = initialState, action) => {
    switch(action.type) {
        case activityActionTypes.SET_ACTIVITY_FILTERED: {
            return {
                ...state,
                activityFiltered: action.payload.activityFiltered, // oklart...
            }
        }
        default: {
            return state;
        }
    }
};

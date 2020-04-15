import {activityActionTypes} from './actions';

interface EventsState {
    activity: object | null, // oklart
}

const initialState: EventsState = {
    activity: {}, // oklart
};

export const activityReducer = (state = initialState, action) => {
    switch(action.type) {
        case activityActionTypes.SET_ACTIVITY: {
            return {
                ...state,
                activity: action.payload.activity, // oklart...
            }
        }
        default: {
            return state;
        }
    }
};

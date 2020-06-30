import {fleetAnalysisActionTypes} from './actions';

// This reducer holds the same data as fleet.
// We use a separare reducer for fleet analyze to let components update state without affecting each other.
interface fleetAnalysisState {
    fleet: object| null,
}

const initialState: fleetAnalysisState = {
    fleet: null,
};

export const fleetAnalysisReducer = (state = initialState, action) => {
    switch(action.type) {
        case fleetAnalysisActionTypes.SET_FLEET: {
            return {
                ...state,
                fleet: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

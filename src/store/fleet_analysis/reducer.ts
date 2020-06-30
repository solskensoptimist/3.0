import {fleetAnalysisActionTypes} from './actions';

// This reducer holds the same data as fleet.
// We use a separare reducer for fleet analyze to let components update state without affecting each other.
interface fleetAnalysisState {
    fleetAnalysis: object| null,
}

const initialState: fleetAnalysisState = {
    fleetAnalysis: null,
};

export const fleetAnalysisReducer = (state = initialState, action) => {
    switch(action.type) {
        case fleetAnalysisActionTypes.SET_FLEET_ANALYSIS: {
            return {
                ...state,
                fleetAnalysis: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

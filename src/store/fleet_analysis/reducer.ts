import {fleetAnalysisActionTypes} from './actions';

interface fleetAnalysisState {
    fleetAnalysis: object| null,
    fleetAnalysisHistoric: object| null,
}

const initialState: fleetAnalysisState = {
    fleetAnalysis: null,
    fleetAnalysisHistoric: null,
};

export const fleetAnalysisReducer = (state = initialState, action) => {
    switch(action.type) {
        case fleetAnalysisActionTypes.SET_FLEET_ANALYSIS: {
            return {
                ...state,
                fleetAnalysis: action.payload,
            }
        }
        case fleetAnalysisActionTypes.SET_FLEET_ANALYSIS_HISTORIC: {
            return {
                ...state,
                fleetAnalysisHistoric: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

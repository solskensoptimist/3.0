import {fleetActionTypes} from './actions';

interface fleetState {
    fleet: object| null,
    fleetHistoric: object | null,
}

const initialState: fleetState = {
    fleet: null,
    fleetHistoric: null,

};

export const fleetReducer = (state = initialState, action) => {
    switch(action.type) {
        case fleetActionTypes.SET_FLEET: {
            return {
                ...state,
                fleet: action.payload,
            }
        }
        case fleetActionTypes.SET_FLEET_HISTORIC: {
            return {
                ...state,
                fleetHistoric: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

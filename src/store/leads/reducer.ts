import {leadsActionTypes} from './actions';

interface leadsState {
    data: object| null,
}

const initialState: leadsState = {
    data: null,
};

export const leadsReducer = (state = initialState, action) => {
    switch(action.type) {
        case leadsActionTypes.SET_LEADS: {
            return {
                ...state,
                data: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

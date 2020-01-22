import {prospectActionTypes} from './actions';

const initialState = {
    data: {
        car: 'car data',
    },
    displayMode: 'result',
};

export const prospectReducer = (state = initialState, action) => {
    switch(action.type) {
        case prospectActionTypes.RESET_SEARCH: {
            return state;
        }
        default: {
            return state;
        }
    }
};

import {agileActionTypes} from './actions';

interface AgileState {
    columns: object | null,
    data: object | null,
}

const initialState: AgileState = {
    columns: null,
    data: null,
};

export const agileReducer = (state = initialState, action) => {
    switch(action.type) {
        case agileActionTypes.SET_AGILE_DATA: {
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

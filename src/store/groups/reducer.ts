import {groupsActionTypes} from './actions';

const initialState = {
    dealer: [],
    region: [],
};

export const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
        case groupsActionTypes.SET_GROUPS: {
            return {
                ...state,
                data: action.payload
            }
        }
        default: {
            return state;
        }
    }
};

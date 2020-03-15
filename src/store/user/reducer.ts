import {userActionTypes} from './actions';

const initialState = {
    data: {},
    colleagues: [],
    connections: [],
};

export const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case userActionTypes.USER_LOGIN: {
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

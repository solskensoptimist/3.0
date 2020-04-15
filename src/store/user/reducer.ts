import {userActionTypes} from './actions';

interface UserState {
    colleagues: Array<object> | null,
    connections: Array<object> | null,
    info: object | null,
}

const initialState: UserState = {
    colleagues: null,
    connections: null,
    info: null,
};

export const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case userActionTypes.USER_LOGIN: {
            return {
                ...state,
                info: action.payload.info
            }
        }
        default: {
            return state;
        }
    }
};

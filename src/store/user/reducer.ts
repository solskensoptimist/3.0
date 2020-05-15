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
        case userActionTypes.SET_USER_COLLEAGUES: {
            return {
                ...state,
                colleagues: action.payload
            }
        }
        case userActionTypes.SET_USER_CONNECTIONS: {
            return {
                ...state,
                connections: action.payload
            }
        }
        case userActionTypes.SET_USER_INFO: {
            return {
                ...state,
                info: action.payload
            }
        }
        default: {
            return state;
        }
    }
};

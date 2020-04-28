import {commentActionTypes} from './actions';

interface EventsState {
    comment: object | null,
}

const initialState: EventsState = {
    comment: null,
};

export const commentReducer = (state = initialState, action) => {
    switch(action.type) {
        case commentActionTypes.SET_COMMENT: {
            return {
                ...state,
                comment: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

import {commentActionTypes} from './actions';

interface CommentState {
    added: string | null,
    comment: string | null,
    dealer_id: number | null,
    id: number | null,
    target: string | null,
    user_id: number | null,
}

const initialState: CommentState = {
    added: null,
    comment: null,
    dealer_id: null,
    id: null,
    target: null,
    user_id: null,
};

export const commentReducer = (state = initialState, action) => {
    switch(action.type) {
        case commentActionTypes.SET_COMMENT: {
            return {
                ...state,
                added: action.payload.added,
                comment: action.payload.comment,
                dealer_id: action.payload.dealer_id,
                id: action.payload.id,
                target: action.payload.target,
                user: action.payload.user_id,
            }
        }
        case commentActionTypes.SET_COMMENT_COMMENT: {
            return {
                ...state,
                comment: action.payload.comment,
            }
        }
        default: {
            return state;
        }
    }
};

import {flashMessagesActionTypes} from './actions';

interface flashMessagesState {
    message: string,
    showMessage: boolean,
}

const initialState: flashMessagesState = {
    message: ' asdas dass ddaa da dada ',
    showMessage: true,
};

export const flashMessagesReducer = (state = initialState, action) => {
    switch(action.type) {
        case flashMessagesActionTypes.SET_MESSAGE: {
            return {
                ...state,
                message: action.payload,
                }
            }
        case flashMessagesActionTypes.SET_SHOW_MESSAGE: {
            return {
                ...state,
                showMessage: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

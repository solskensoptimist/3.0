import {contactsActionTypes} from './actions';

interface ContactsState {
    contacts: Array<object> | null,
    target: string | null,
}

const initialState: ContactsState = {
    contacts: null,
    target: null,
};

export const contactsReducer = (state = initialState, action) => {
    switch(action.type) {
        case contactsActionTypes.SET_CONTACTS: {
            return {
                ...state,
                contacts: action.payload,
            }
        }
        case contactsActionTypes.SET_TARGET: {
            return {
                ...state,
                target: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

import {contactsActionTypes} from './actions';

interface ContactsState {
    contacts: Array<object> | null,
    entityId: string | null,
}

const initialState: ContactsState = {
    contacts: null,
    entityId: null,
};

export const contactsReducer = (state = initialState, action) => {
    switch(action.type) {
        case contactsActionTypes.SET_CONTACTS: {
            return {
                ...state,
                contacts: action.payload,
            }
        }
        case contactsActionTypes.SET_ENTITY_ID: {
            return {
                ...state,
                entityId: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

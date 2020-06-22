import {personActionTypes} from './actions';

interface PersonState {
    person: object | null,
    deals: Array<object> | null,
    fleet: object | null,
    responsible: object | null,
    supertemp: Array<object> | null,
}

const initialState: PersonState = {
    person: null,
    deals: null,
    fleet: null,
    responsible: null,
    supertemp: null,
};

export const personReducer = (state = initialState, action) => {
    switch(action.type) {
        case personActionTypes.SET_PERSON: {
            return {
                ...state,
                person: action.payload.person,
                supertemp: action.payload.supertemp,
            }
        }
        case personActionTypes.SET_PERSON_CONSENT: {
            return {
                ...state,
                person: {
                    ...state.person,
                    consent: action.payload,
                },
            }
        }
        case personActionTypes.SET_PERSON_DEALS: {
            return {
                ...state,
                deals: action.payload,
            }
        }
        case personActionTypes.SET_PERSON_EMAILS: {
            return {
                ...state,
                person: {
                    ...state.person,
                    emails: action.payload,
                }
            }
        }
        case personActionTypes.SET_PERSON_PHONENUMBERS: {
            return {
                ...state,
                person: {
                    ...state.person,
                    phoneNumbers: action.payload,
                }
            }
        }
        case personActionTypes.SET_PERSON_RESPONSIBLE: {
            return {
                ...state,
                responsible: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

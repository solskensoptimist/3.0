import {companyActionTypes} from './actions';

interface CompanyState {
    company: object | null,
    deals: Array<object> | null,
    fleet: object | null,
    koncern: object | null,
    koncernDeals: Array<object> | null,
    responsible: object | null,
    supertemp: Array<object> | null,
}

const initialState: CompanyState = {
    company: null,
    deals: null,
    fleet: null,
    koncern: null,
    koncernDeals: null,
    responsible: null,
    supertemp: null,
};

export const companyReducer = (state = initialState, action) => {
    switch(action.type) {
        case companyActionTypes.SET_COMPANY: {
            return {
                ...state,
                company: action.payload.company,
                deals: action.payload.deals,
                fleet: action.payload.fleet,
                koncern: action.payload.koncern,
                koncernDeals: action.payload.koncernDeals,
                supertemp: action.payload.supertemp,
            }
        }
        case companyActionTypes.SET_COMPANY_EMAILS: {
            return {
                ...state,
                company: {
                    ...state.company,
                    emails: action.payload,
                }
            }
        }
        case companyActionTypes.SET_COMPANY_PHONENUMBERS: {
            return {
                ...state,
                company: {
                    ...state.company,
                    phoneNumbers: action.payload,
                }
            }
        }
        case companyActionTypes.SET_COMPANY_RESPONSIBLE: {
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

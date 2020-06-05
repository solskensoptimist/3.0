import {companyActionTypes} from './actions';

interface CompanyState {
    company: object | null,
    deals: Array<object> | null,
    fleet: object | null,
    koncern: object | null,
    koncernDeals: Array<object> | null,
    supertemp: Array<object> | null,
}

const initialState: CompanyState = {
    company: null,
    deals: null,
    fleet: null,
    koncern: null,
    koncernDeals: null,
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
        default: {
            return state;
        }
    }
};

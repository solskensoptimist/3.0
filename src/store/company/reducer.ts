import {companyActionTypes} from './actions';

interface CompanyState {
    company: object | null,
}

const initialState: CompanyState = {
    company: null,
};

export const companyReducer = (state = initialState, action) => {
    switch(action.type) {
        case companyActionTypes.SET_COMPANY: {
            return {
                ...state,
                company: action.payload.company,
            }
        }
        default: {
            return state;
        }
    }
};

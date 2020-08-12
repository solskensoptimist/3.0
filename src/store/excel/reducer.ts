import {excelActionTypes} from './actions';

interface ExcelState {
    activeSelectors: Array<string>,
}

const initialState: ExcelState = {
    activeSelectors: [],
};

export const excelReducer = (state = initialState, action) => {
    switch(action.type) {
        case excelActionTypes.SET_ACTIVE_SELECTORS: {
            return {
                ...state,
                activeSelectors: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

import {excelActionTypes} from './actions';

interface ExcelState {
    savedSelectors: Array<string>,
}

const initialState: ExcelState = {
    savedSelectors: [],
};

export const excelReducer = (state = initialState, action) => {
    switch(action.type) {
        case excelActionTypes.SET_SAVED_SELECTORS: {
            return {
                ...state,
                savedSelectors: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

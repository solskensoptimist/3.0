import {prospectActionTypes} from './actions';

interface ProspectState {
    displayMode: string | null,
}

const initialState: ProspectState = {
    displayMode: null,
};

export const prospectReducer = (state = initialState, action) => {
    switch(action.type) {
        case prospectActionTypes.RESET_SEARCH: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

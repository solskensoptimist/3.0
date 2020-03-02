import {settingsActionTypes} from './actions';

const initialState = {
    data: {},
    searchTerm: null,
    settings: null,
};

export const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case settingsActionTypes.SET_SETTINGS: {
            return {
                ...state,
                data: action.payload.data,
                settings: action.payload.settings
            }
        }
        default: {
            return state;
        }
    }
};

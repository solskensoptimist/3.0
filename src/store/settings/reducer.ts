import {settingsActionTypes} from './actions';

interface SettingsState {
    email: boolean | null,
}

const initialState: SettingsState = {
    email: null,
};

export const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case settingsActionTypes.SET_SETTINGS: {
            return {
                ...state,
                email: action.payload.email,
            }
        }
        default: {
            return state;
        }
    }
};

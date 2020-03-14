import {settingsActionTypes} from './actions';

interface SettingsState {
    email: boolean | null,
    showSettings: boolean,
}

const initialState: SettingsState = {
    email: null,
    showSettings: false,
};

export const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case settingsActionTypes.SET_SETTINGS: {
            return {
                ...state,
                email: action.payload.email,
            }
        }
        case settingsActionTypes.SET_SHOW_SETTINGS: {
            return {
                ...state,
                showSettings: action.payload.showSettings,
            }
        }
        default: {
            return state;
        }
    }
};

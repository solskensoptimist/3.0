import {settingsActionTypes} from './actions';

interface SettingsState {
    dashboard: {} | null,
    email: boolean | null,
}

const initialState: SettingsState = {
    dashboard: {
        data: [{type: 'news', position: 1}, {type: 'events', position: 2}], // Default if no dashboard settings.
        user_id: null,
        _id: null,
    },
    email: null,
};

export const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case settingsActionTypes.SET_DASHBOARD_SETTINGS: {
            return {
                ...state,
                dashboard: action.payload,
            }
        }
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

import {store} from 'store';
import {request} from 'helpers';
import {settingsActionTypes} from "store/settings/actions";
import SettingsHelper from 'shared_helpers/settings_helper';

/**
 * Get settings for logged in user.
 */
export const getSettings = async () => {
    request({
        method: 'get',
        url: '/settings',
    })
    .then((data) => {
        // Backend holds a lot of info we dont use in 3.0, only set email setting for now.
        const savedSettings = SettingsHelper.getSavedSettings(data.settings);
        const categorized = SettingsHelper.categorizeFlags(savedSettings);
        let payload = {
            email: categorized.email,
        };

        return store.dispatch({ type: settingsActionTypes.SET_SETTINGS, payload: payload });
    })
    .catch((err) => {
        return console.error('Error in getSettings:', err);
    });
};

/**
 * Save new password.
 *
 * @param payload.password
 */
export const savePassword = async (payload) => {
    request({
        data: { password: payload.password },
        method: 'put',
        url: '/settings/password',
    })
    .then(() => {
        return true;
    })
    .catch((err) => {
        return console.error('Error in savePassword:', err);
    });
};

/**
 * Save new settings.
 */
export const saveSettings = async (payload) => {
    const settingBit = SettingsHelper.computeSettingBit(payload, true);

    request({
        data: { settings: settingBit },
        method: 'put',
        url: '/settings',
    })
    .then(() => {
        return getSettings();
    })
    .catch((err) => {
        return console.error('Error in saveSettings:', err);
    });
};

/**
 * Set show settings.
 *
 * @param payload.showSettings
 */
export const setShowSettings = (payload) => {
    return store.dispatch({ type: settingsActionTypes.SET_SHOW_SETTINGS, payload: payload });
};

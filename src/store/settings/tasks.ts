import {store} from 'store';
import {request} from 'helpers';
import {settingsActionTypes} from "store/settings/actions";
import SettingsHelper from 'shared_helpers/settings_helper';

/**
 * Get settings for logged in user.
 */
export const getSettings = async () => {
    try {
        const data = await request({
            method: 'get',
            url: '/settings',
        });

        if (!data || data instanceof Error) {
            return console.error('Error in getSettings:\n' + data);
        }
        if (data && !data.settings) {
            return console.log('No settings data');
        }

        // Backend holds a lot of info we dont use in 3.0, only set email setting for now.
        const savedSettings = SettingsHelper.getSavedSettings(data.settings);
        const categorized = SettingsHelper.categorizeFlags(savedSettings);
        const result = {
            email: categorized.email,
        };

        return store.dispatch({type: settingsActionTypes.SET_SETTINGS, payload: result});
    } catch (err) {
        return console.error('Error in getSettings:\n' + err);
    }
};

/**
 * Save new password.
 *
 * @param payload.password
 */
export const savePassword = async (payload) => {
    try {
        return await request({
            data: { password: payload.password },
            method: 'put',
            url: '/settings/password',
        });
    } catch (err) {
        return console.error('Error in savePassword:\n' + err);
    }
};

/**
 * Save new settings.
 */
export const saveSettings = async (payload) => {
    try {
        const settingBit = SettingsHelper.computeSettingBit(payload, true);

        await request({
            data: { settings: settingBit },
            method: 'put',
            url: '/settings',
        });

        return await getSettings();
    } catch (err) {
        return console.error('Error in saveSettings:\n' + err);
    }
};

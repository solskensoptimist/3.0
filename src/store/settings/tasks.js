import {store} from 'store';
import {request} from 'helpers/request_helper';
import {settingsActionTypes} from "store/settings/actions";
import SettingsHelper from 'shared_helpers/settings_helper';

/**
 * Get settings for logged in user.
 */
export const getSettings = () => {
    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            url: 'settings',
        })
            .then((data) => {
                const savedSettings = SettingsHelper.getSavedSettings(data.settings);
                const categorized = SettingsHelper.categorizeFlags(savedSettings);
                let payload = {
                    data: data,
                    settings: categorized
                };
                resolve(store.dispatch({ type: settingsActionTypes.SET_SETTINGS, payload: payload }));
            });
    });
};

/**
 * Set new settings.
 */
export const newSettings = (payload) => {
    return new Promise((resolve, reject) => {
        var settingBit = SettingsHelper.computeSettingBit(payload.settings, true);
        console.log('settingBit', settingBit);
        request({
            data: { settings: settingBit, def: payload.def, },
            method: 'put',
            url: 'settings',
        })
            .then((data) => {
                const savedSettings = SettingsHelper.getSavedSettings(data.settings);
                const categorized = SettingsHelper.categorizeFlags(savedSettings);
                let payload = {
                    data: data,
                    settings: categorized
                };
                resolve(store.dispatch({ type: settingsActionTypes.SET_SETTINGS, payload: payload }));
            });
    });
};

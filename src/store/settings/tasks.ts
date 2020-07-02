import {store} from 'store';
import {request} from 'helpers';
import {settingsActionTypes} from './actions';
import {userActionTypes} from 'store/user/actions';
import SettingsHelper from 'shared_helpers/settings_helper';
import {showFlashMessage} from 'store/flash_messages/tasks';

/**
 * Get settings for dashboard.
 */
export const getDashboardSettings = async () => {
    try {
        const data = await request({
            method: 'get',
            url: '/dashboard/',
        });

        if (!data || data instanceof Error) {
            return console.error('Could not get dashboard settings:\n' + data);
        }

        if (data.data && data.data.length) {
            let hit = false;
            // Remove multiple leads widgets with this l33t filtering.
            data.data = data.data.filter((num) =>  {
                if (hit && num.type === 'leads') {
                    return null;
                }
                if (!hit && num.type === 'leads') {
                    hit = true;
                }
                return num;
            });

            // Sort on position.
            data.data = data.data.sort((a: any, b: any) => {
                if ( a.position < b.position){
                    return -1;
                } else if ( a.position > b.position){
                    return 1;
                } else {
                    return 0;
                }
            });
        }

        return store.dispatch({type: settingsActionTypes.SET_DASHBOARD_SETTINGS, payload: data});
    } catch (err) {
        return console.error('Error in getDashboardSettings:\n' + err);
    }
};

/**
 * Get settings for logged in user.
 */
export const getSettings = async () => {
    try {
        const data = await request({
            method: 'get',
            url: '/settings/',
        });

        if (data instanceof Error) {
            return console.error('Error in getSettings:\n' + data);
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
 * This is only for the settings that is handled by the 'settings' field in user table.
 * I.E. do not include 'dashboard' property or 'lang' property in payload.
 */
export const saveSettings = async (payload) => {
    try {
        const settingBit = SettingsHelper.computeSettingBit(payload, true);

        await request({
            data: {settings: settingBit},
            method: 'put',
            url: '/settings',
        });

        return await getSettings();
    } catch (err) {
        return console.error('Error in saveSettings:\n' + err);
    }
};

/**
 * Save new settings.
 * This is only for the settings that is handled by the 'settings' field in user table.
 * I.E. do not include 'dashboard' property or 'lang' property in payload.
 */
export const saveLanguage = async (payload) => {
    try {
        if (!payload || !payload.lang) {
            return console.log('Missing params in saveLanguage');
        }

        const data = await request({
            data: {
                lang: payload.lang
            },
            method: 'put',
            url: '/user/setLanguage/',
        });

        if (!data || data instanceof Error) {
            return console.error('Could not update language:\n' + data);
        }

        store.dispatch({type: userActionTypes.SET_USER_LANG, payload: payload.lang});

        if (payload.lang === 'swe') {
            return showFlashMessage('För att ändra språk krävs en ny inloggning');
        } else {
            return showFlashMessage('Change of language requires a new login');
        }
    } catch (err) {
        return console.error('Error in saveSettings:\n' + err);
    }
};

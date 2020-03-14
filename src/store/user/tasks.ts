import {store} from 'store';
import {request} from 'helpers';
import {settingsActionTypes} from "store/settings/actions";
import {userActionTypes} from "store/user/actions";
import {getEvents} from 'store/events/tasks';

/**
 * Send login request, set user data to store state.
 * @param credentials.email (string)
 * @param credentials.password (string)
 */
export const userLogin = async (credentials) => {
    await request({
        data: credentials,
        method: 'post',
        url: '/login',
    })
    .then(async (data) => {
        await getEvents({});
        return store.dispatch({ type: userActionTypes.USER_LOGIN, payload: data });
    });
};

/**
 * Send logout request.
 */
export const userLogout = async () => {
    store.dispatch({type: settingsActionTypes.SET_SHOW_SETTINGS, payload: {showSettings: false}});
    await request({
        method: 'get',
        url: '/logout',
    })
    .then((data) => {
        window.location.href = '/';
        return store.dispatch({type: userActionTypes.USER_LOGOUT});
    });
};

import {store} from 'store';
import {request} from 'helpers';
import {settingsActionTypes} from "store/settings/actions";
import {rootActionTypes} from "store/actions";
import {userActionTypes} from "store/user/actions";

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
        // Fix: IMPLEMENT ASYNC REDUX ACTION, REMOVE SETTIMEOUT
        store.dispatch({ type: userActionTypes.USER_LOGIN, payload: data });
        setTimeout(() => {
            window.location.href = '/';
        }, 200)
    })
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
        return store.dispatch({type: rootActionTypes.CLEAR_STATE});
    })
};

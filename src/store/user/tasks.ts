import {store} from 'store';
import {request} from 'helpers';
import {userActionTypes} from "store/user/actions";

/**
 * Remove all of local storage.
 */
export const clearState = async () => {
    return store.dispatch({ type: userActionTypes.CLEAR_STATE}); // Handled in rootReducer.
};

/**
 * Send login request, set user data to store state.
 * @param credentials.email (string)
 * @param credentials.password (string)
 */
export const userLogin = async (credentials) => {
    await request({
        data: credentials,
        method: 'post',
        url: 'login',
    })
    .then((data) => {
        return store.dispatch({ type: userActionTypes.USER_LOGIN, payload: data });
    });
};

/**
 * Send logout request.
 */
export const userLogout = async () => {
    await request({
        method: 'get',
        url: 'logout',
    })
    .then((data) => {
        window.location.href = '/';
        return store.dispatch({ type: userActionTypes.USER_LOGOUT});
    });
};

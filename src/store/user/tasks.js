import {store} from 'store';
import {request} from 'helpers/request_helper';
import {userActionTypes} from "store/user/actions";
/**
 * Send login request, set user data to store state.
 * @param credentials.email (string)
 * @param credentials.password (string)
 */
export const userLogin = (credentials) => {
    return new Promise((resolve, reject) => {
        request({
            data: credentials,
            method: 'post',
            url: 'login',
        })
        .then((data) => {
            resolve(store.dispatch({ type: userActionTypes.USER_LOGIN, payload: data }));
        });
    });
};

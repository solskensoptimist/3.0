import {store} from 'store';
import {request} from 'helpers';
import {rootActionTypes} from "store/actions";
import {userActionTypes} from "store/user/actions";

/**
 * Send login request, set user data to store state.
 * @param credentials.email (string)
 * @param credentials.password (string)
 */
export const userLogin = async (credentials) => {
    try {
        const user = await request({
            data: credentials,
            method: 'post',
            url: '/login',
        });

        if (!user || (user && !user.id)) {
            return console.log('Missing user data.');
        }

        if (user instanceof Error) {
            console.error('Error in userLogin:\n' + user);
        }

        // Fix: IMPLEMENT ASYNC REDUX ACTION, REMOVE SETTIMEOUT
        store.dispatch({type: userActionTypes.USER_LOGIN, payload: {info: user}});
        return setTimeout(() => {
            window.location.href = '/';
        }, 200);
    } catch (err) {
        return console.error('Error in userLogin:\n' + err);
    }
};

/**
 * Send logout request.
 */
export const userLogout = async () => {
    try {
        await request({
            method: 'get',
            url: '/logout',
        });

        window.location.href = '/';
        return store.dispatch({type: rootActionTypes.CLEAR_STATE});
    } catch (err) {
        return console.error('Error in userLogout:\n' + err);
    }
};

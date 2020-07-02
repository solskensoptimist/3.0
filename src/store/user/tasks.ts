import {store} from 'store';
import {request} from 'helpers';
import {rootActionTypes} from "store/actions";
import {userActionTypes} from "store/user/actions";

/**
 * Get user colleagues on same dealer.
 */
const getUserColleagues = async () => {
    try {
        const colleagues = await request({
            method: 'get',
            url: '/user/getUsersByDealerId',
        });

        if (colleagues instanceof Error) {
            return console.error('Error in getUserColleagues:\n' + colleagues);
        }

        return store.dispatch({type: userActionTypes.SET_USER_COLLEAGUES, payload: colleagues});
    } catch (err) {
        return console.error('Error in getUserColleagues:\n' + err);
    }
};

/**
 * Get user connections, I.E. connected dealers and their users.
 */
const getUserConnections = async () => {
    try {
        const connections = await request({
            method: 'get',
            url: '/user/hierarchy',
        });

        if (connections instanceof Error) {
            return console.error('Error in getUserColleagues:\n' + connections);
        }

        return store.dispatch({type: userActionTypes.SET_USER_CONNECTIONS, payload: connections});
    } catch (err) {
        return console.error('Error in getUserColleagues:\n' + err);
    }
};

/**
 * Send login request, set user data to store state.
 * @param credentials.email (string)
 * @param credentials.password (string)
 */
export const userLogin = async (credentials) => {
    try {
        let user = await request({
            data: credentials,
            method: 'post',
            url: '/login',
        });

        if (!user || (user && !user.id)) {
            return console.log('Missing user data.');
        }

        if (user instanceof Error) {
            return console.error('Error in userLogin:\n' + user);
        }

        // Fix: Implement async redux actions, remove setTimeout below.
        store.dispatch({type: userActionTypes.SET_USER_INFO, payload: user});

        await getUserColleagues();
        await getUserConnections();

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

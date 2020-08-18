import {store} from 'store';
import {request} from 'helpers';
import {rootActionTypes} from "store/actions";
import {userActionTypes} from "store/user/actions";
import {getLists} from 'store/lists/tasks';
import history from '../../router_history';
import userHelper from 'shared_helpers/user_helper';

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

export const isBigExcelUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().BIG_EXCEL);
};

export const isBlockExcelUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().BLOCK_EXCEL);
};

export const isBuUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().BU_FLAG);
};

export const isHbUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().HB_FLAG);
};

export const isHvUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().HV_FLAG);
};

export const isLbUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().LB_FLAG);
};

export const isPbUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().PB_FLAG);
};

export const isSupertempUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().SUPERTEMP_FLAG);
};

export const isSvUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().SV_FLAG);
};

export const isTlbUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().TLB_FLAG);
};

export const isTrUser = () => {
    return !!(store.getState().user.info.status & userHelper.getBitFlags().TR_FLAG);
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
        } else {
            store.dispatch({type: userActionTypes.SET_USER_INFO, payload: user});
            history.push('');
            getUserColleagues();
            getUserConnections();
            getLists({});
            return getLists({archived: true});
        }
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

        store.dispatch({type: rootActionTypes.CLEAR_STATE});
        return history.push('');
    } catch (err) {
        return console.error('Error in userLogout:\n' + err);
    }
};

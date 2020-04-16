import {store} from 'store';
import {request} from 'helpers';
import {activityActionTypes} from './actions';

/**
 * Retrieve activity based on filter.
 */
export const getActivityByFilter = async () => {
    const filter = store.getState().filter;

    request({
        data: {
            limit: 9999,
            users: filter.users,
            widgetFilters: {
                date: filter.date,
                lists: filter.lists,
            },
        },
        method: 'post',
        url: '/activity/dealer/',
    })
    .then((data) => {
        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_FILTER, payload: {activityByFilter: data}});
    })
    .catch((err) => {
        return console.error('Error in getActivityByFilter:', err);
    });
};

/**
 * Retrieve activity based on target id.
 *
 * @param payload.id - Can be a prospect id (user id/orgnr) or a deal id.
 * @param payload.type - Set this to 'deal' when payload.id is a deal id.
 */
export const getActivityByTarget = async (payload) => {
    if (!payload || (payload && !payload.id)) {
        return console.error('Missing params in getActivityByTarget');
    }

    // For deals we use a different endpoint.
    const url = (payload.type && payload.type === 'deal') ?
        '/activity/deal/' + payload.id :
        '/comments/' + payload.id;

    request({
        method: 'get',
        url: url,
    })
    .then((data) => {
        const result = {
            data: data,
            id: payload.id,
        };

        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_TARGET, payload: {activityByTarget: result}});
    })
    .catch((err) => {
        return console.error('Error in getActivityByTarget:', err);
    });
};

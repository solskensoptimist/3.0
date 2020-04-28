import {store} from 'store';
import {request} from 'helpers';
import {activityActionTypes} from './actions';

/**
 * Retrieve activity based on filter.
 */
export const getActivityByFilter = async () => {
    try {
        store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_FILTER, payload: []}); // Clear old.

        const filter = store.getState().filter;
        const data = await request({
            data: {
                includeAllComments: true,
                limit: 9999,
                users: filter.users,
                widgetFilters: {
                    date: filter.date,
                    lists: filter.lists,
                },
            },
            method: 'post',
            url: '/activity/dealer/',
        });

        const result = (data && data.length && !(data instanceof Error)) ? data.filter((num) => {
                return !('complete' in num && num.complete === false);
            }).map((num) => {
                if (!num.date_created && num.added) {
                    num.date_created = num.added; // To keep it consistent for component rendering.
                }

                return num;
            })
            : [];

        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_FILTER, payload: result});
    } catch (err) {
        return console.error('Error in getActivityByFilter:\n' + err);
    }
};

/**
 * Retrieve activity based on target id.
 *
 * @param payload.id - Can be a prospect id (user id/orgnr) or a deal id.
 * @param payload.type - Set this to 'deal' when payload.id is a deal id.
 */
export const getActivityByTarget = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getActivityByTarget');
        }

        store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_TARGET, payload: []}); // Clear old.

        // For deals we use a different endpoint.
        const url = (payload.type && payload.type === 'deal') ?
            '/activity/deal/' + payload.id :
            '/comments/' + payload.id;

        const data = await request({
            method: 'get',
            url: url,
        });

        const result = (data && data.length && !(data instanceof Error)) ? data.filter((num) => {
                return !('complete' in num && num.complete === false);
            }).map((num) => {
                if (!num.date_created && num.added) {
                    num.date_created = num.added; // To keep it consistent for component rendering.
                }

                return num;
            })
            : [];

        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_TARGET, payload: result});
    } catch (err) {
        return console.error('Error in getActivityByTarget:\n' + err);
    }
};

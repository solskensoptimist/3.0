import {store} from 'store';
import {request} from 'helpers';
import {activityActionTypes} from './actions';
import {eventsActionTypes} from "../events/actions";

/**
 * Get activity main func.
 *
 * @payload.type - string - Can be 'filter' | 'last' | 'target'.
 * @payload.target  - string - Only required/working when type === 'target'. Can be prospect id or deal id.
 */
export const getActivity = async (payload) => {
    if (payload.type !== 'last') {
        // Save search.
        store.dispatch({type: eventsActionTypes.SET_LAST_SEARCH, payload: payload});
    }

    try {
        switch (payload.type) {
            case 'filter':
                return await getActivityByFilter();
            case 'last':
                const lastSearch = (store.getState().activity.lastSearch) ? store.getState().activity.lastSearch : null;
                if (lastSearch) {
                    return await getActivity(lastSearch);
                } else {
                    return console.error('No last search in getActivity');
                }
            case 'target':
                return await getActivityByTarget({target: payload.target});
            default:
                return await getActivityByFilter();
        }
    } catch (err) {
        console.error('Error in getActivity:\n' + err);
    }
};

/**
 * Retrieve activity based on filter.
 */
const getActivityByFilter = async () => {
    try {
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

        let result = (data && data.length && !(data instanceof Error)) ? data.filter((num) => {
                return !('complete' in num && num.complete === false);
            }).map((num) => {
                if (!num.date_created && num.added) {
                    num.date_created = num.added; // To keep it consistent for component rendering.
                }
                return num;
            })
            : [];

        result = result.sort((a, b) => {
            return (new Date(a.date_created) < new Date(b.date_created)) ? 1 : -1;
        });

        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_FILTER, payload: result});
    } catch (err) {
        return console.error('Error in getActivityByFilter:\n' + err);
    }
};

/**
 * Retrieve activity based on target id.
 *
 * @param payload.target - Can be a prospect id (user id/orgnr) or a deal id.
 */
const getActivityByTarget = async (payload) => {
    try {
        if (!payload || (payload && !payload.target)) {
            return console.error('Missing target in getActivityByTarget');
        }

        // Different endpoint for deals than temp_prospectids_table_name.
        const url = (payload.target.length > 14) ? '/activity/deal/' + payload.target : '/comments/' + payload.target;

        const data = await request({
            method: 'get',
            url: url,
        });

        let activities = (data && data.length && !(data instanceof Error)) ? data.filter((num) => {
                return !('complete' in num && num.complete === false);
            }).map((num) => {
                if (!num.date_created && num.added) {
                    num.date_created = num.added; // To keep it consistent for component rendering.
                }
                return num;
            })
            : [];

        activities = activities.sort((a, b) => {
            return (new Date(a.date_created) < new Date(b.date_created)) ? 1 : -1;
        });

        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_TARGET, payload: activities});
    } catch (err) {
        return console.error('Error in getActivityByTarget:\n' + err);
    }
};

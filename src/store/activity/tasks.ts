import {store} from 'store';
import {request} from 'helpers';
import {activityActionTypes} from './actions';

/**
 * Retrieve activity based on filter.
 */
export const getActivityByFilter = async () => {
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
 * @param payload.id - Can be a prospect id (user id/orgnr) or a deal id. If no id, do search for last target in store.
 */
export const getActivityByTarget = async (payload) => {
    try {
        // Set new target, or retrieve from store state.
        let target;
        if (payload.id) {
            target = payload.id;
        } else {
            target = store.getState().activity.activityByTarget.target;
            if (!target) {
                // If no target, don't do nutting.
                return;
            }
        }

        console.log('getactivitytarget', target);

        // Different endpoint for deals than prospects.
        const url = (target.length > 13) ? '/activity/deal/' + target : '/comments/' + target;

        console.log(url);

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

        console.log('activitiit', activities);

        return store.dispatch({type: activityActionTypes.SET_ACTIVITY_BY_TARGET, payload: {activities: activities, target: target}});
    } catch (err) {
        return console.error('Error in getActivityByTarget:\n' + err);
    }
};

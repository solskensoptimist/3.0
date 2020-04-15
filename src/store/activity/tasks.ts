import {store} from 'store';
import {request} from 'helpers';
import {activityActionTypes} from './actions';

/**
 * Retrieve activity based on filter.
 */
export const getActivityByFilter = async () => {
    /*
    const filter = store.getState().filter;

    Upprepa vad som sker i WidgetActivityStoresuperagent:

    .post('/activity/dealer/')
    .send({
        limit: 9999, // Intentional high bound, let components handle pagination.
        users: users,
        widgetFilters: widgetFilters,
    })

    osv.
     */


    // .then((data) => {
    //     return store.dispatch({ type: activityActionTypes.SET_ACTIVITY_BY_FILTER, payload: {activityFiltered: data} });
    // })
    // .catch((err) => {
    //     return console.error('Error in getActivityByFilter:', err);
    // });
};

/**
 * Retrieve activity based on target id.
 *
 * @param payload.id - Target id, can be user id, orgnr or deal id. <-----STÄMMER DETTA ?!?!?!?!?!?!?
 */
export const getActivityByTarget = async (payload) => {

    // payload.id = 5209064699; // TEMPORARY....

    if (!payload || (payload && !payload.id)) {
        return console.error('Missing params in getActivityByTarget');
    }

    request({
        method: 'get',
        url: '/comments/' + payload.id,
    })
    .then((data) => {
        const result = {
            data: data,
            id: payload.id,
        };

        return store.dispatch({ type: activityActionTypes.SET_ACTIVITY_BY_TARGET, payload: {activityByTarget: result} });
    })
    .catch((err) => {
        return console.error('Error in getActivityByTarget:', err);
    });
};

import {store} from 'store';
import {request} from 'helpers';
import {leadsActionTypes} from './actions';

/**
 * Fetch leads (for both widget or page view).
 *
 * @param payload.limit - number (optional)
 */
export const getLeads = async (payload) => {
    try {
        const data = await request({
            data: {
                limit: payload.limit ? payload.limit : 0,
            },
            method: 'get',
            url: '/api/leads/get/',
        });

        if (!data || data instanceof Error) {
            console.log('No data in getLeads:\n' + data);
            return store.dispatch({type: leadsActionTypes.SET_LEADS, payload: {}});
        }

        return store.dispatch({type: leadsActionTypes.SET_LEADS, payload: data});
    } catch (err) {
        return console.error('Error in getLeads:\n' + err);
    }
};

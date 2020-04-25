import {store} from 'store';
import {request} from 'helpers';
import {dealActionTypes} from './actions';

/**
 * Retrieve one deal.
 */
export const getDeal = async (payload) => {
    if (!payload || !payload.id) {
        return console.error('Missing params in getDeal');
    }

    try {
        // Get deal.
        const deal = await request({
            method: 'get',
            url: '/deals/' + payload.id,
        });

        if (!deal || deal instanceof Error) {
            return console.error('No data in getDeal');
        }

        // Get list name.
        const list = await request({
            method: 'get',
            url: '/lists/' + deal.meta.moved_from_list,
        });

        const listOrigin = (list && !(list instanceof Error)) ? list.name : '';

        store.dispatch({ type: dealActionTypes.SET_DEAL, payload: {deal: deal} });
        return store.dispatch({ type: dealActionTypes.SET_LIST_ORIGIN, payload: {listOrigin: listOrigin} });
    } catch(err) {
        return console.error('Error in getDeal:', err);
    }
};

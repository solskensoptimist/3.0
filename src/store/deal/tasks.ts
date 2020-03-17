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

    request({
        method: 'get',
        url: '/deals/' + payload.id,
    })
    .then((data) => {
        if (!data) {
            return console.error('No data in getDeal');
        }

        return store.dispatch({ type: dealActionTypes.SET_DEAL, payload: {deal: data} });
    })
    .catch((err) => {
        return console.error('Error in getDeal:', err);
    });
};

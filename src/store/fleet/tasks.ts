import {store} from 'store';
import {request} from 'helpers';
import {fleetActionTypes} from './actions';
import {debounce }from 'debounce';

/**
 * Fetch fleet.
 *
 * @param payload.historic - bool - If we want historic fleet.
 * @param payload.koncern - bool - If we want fleet for koncern.
 * @param payload.sorting - object - {order: 'desc' | 'asc', orderBy: 'column_name'}
 * @param payload.query - string - Search query.
 * @param payload.page - number - Page number.
 * @param payload.prospectId - string - TS user id to fetch data for.
 * @param payload.rowsPerPage - number - Rows per page.
 */
export const getFleet = async (payload) => {
    try {
        if (!payload || (payload && !payload.prospectId)) {
            return console.error('Missing params in getFleet:\n' + payload);
        } else {
            payload.prospectId = payload.prospectId.toString();
        }

        if (payload.historic) {
            store.dispatch({type: fleetActionTypes.SET_FLEET_HISTORIC, payload: {}});
        } else {
            store.dispatch({type: fleetActionTypes.SET_FLEET, payload: {}});
        }

        const data = await request({
            data: {
                historic: payload.historic ? 1 : 0,
                koncern: payload.koncern ? 1 : 0,
                rowsPerPage: payload.rowsPerPage ? payload.rowsPerPage : 10,
                sort: payload.sorting ? payload.sorting : {
                    order: payload.order ? payload.order : 'desc',
                    orderBy: payload.orderBy ? payload.orderBy : null,
                },
                page: payload.page || 0,
                query: (payload.query && payload.query.length) ? payload.query : null,
            },
            method: 'get',
            url: '/fleet/3.0/paginated/'+ payload.prospectId,
        });

        if (!data || data instanceof Error || !data.results) {
            console.log('No data in getFleet', data);
            if (payload.historic) {
                return store.dispatch({type: fleetActionTypes.SET_FLEET_HISTORIC, payload: {}});
            } else {
                return store.dispatch({type: fleetActionTypes.SET_FLEET, payload: {}});
            }
        }

        const result = {
            amount: data.amount,
            data: data.results,
            target: payload.prospectId,
            total: data.total,
        };

        if (payload.historic) {
            return store.dispatch({type: fleetActionTypes.SET_FLEET_HISTORIC, payload: result});
        } else {
            return store.dispatch({type: fleetActionTypes.SET_FLEET, payload: result});
        }
    } catch (err) {
        return console.error('Error in getFleet:\n' + err);
    }
};

// Debounced (used for table search function in Fleet).
export const getFleetDebounced = debounce(getFleet, 200);

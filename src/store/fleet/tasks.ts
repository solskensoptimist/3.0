import {store} from 'store';
import {request} from 'helpers';
import {fleetActionTypes} from './actions';

/**
 * Fetch fleet.
 *
 * @param payload.historic - bool - If we want historic fleet.
 * @param payload.koncern - bool - If we want fleet for koncern.
 * @param payload.page - number - Page number.
 * @param payload.prospectId - string - TS user id to fetch data for.
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

        const historic = payload.historic ? '/historic/' : '';

        const data = await request({
            data: {
                koncern: payload.koncern ? 1 : 0,
                noPagination: 1,
                props: {
                    filter: {},
                    page: payload.page || 0,
                    columns: null,
                }
            },
            method: 'get',
            url: '/fleet/' + payload.prospectId + historic,
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
            amount: data.results.length,
            data: data.results,
            gotAllData: !!(data.gotAllData),
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

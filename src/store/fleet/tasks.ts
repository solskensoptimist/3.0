import {store} from 'store';
import {request} from 'helpers';
import {fleetActionTypes} from './actions';

/**
 * Fetch fleet.
 *
 * @param payload.historic - bool - If we want historic fleet.
 * @param payload.koncern - bool - If we want fleet for koncern.
 * @param payload.noPagination - bool - If we want all cars without pagination.
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

        // No pagination, empty fleets.
        if (!payload.page || payload.noPagination) {
            if (payload.historic) {
                store.dispatch({type: fleetActionTypes.SET_FLEET_HISTORIC, payload: {}});
            } else {
                store.dispatch({type: fleetActionTypes.SET_FLEET, payload: {}});
            }
        }

        const historic = payload.historic ? '/historic/' : '';

        const data = await request({
            data: {
                koncern: payload.koncern ? 1 : 0,
                noPagination: payload.noPagination ? 1 : 0,
                props: {
                    filter: store.getState().filter ? store.getState().filter : {},
                    page: payload.page || 0,
                    // sort: this.sort || false,
                    // search: this.search || null,
                    columns: store.getState().fleet.columns || null,
                }
            },
            method: 'get',
            url: '/fleet/' + payload.prospectId + historic,
        });

        if (!data || data instanceof Error) {
            console.log('No data in getFleet', data);
            if (payload.historic) {
                return store.dispatch({type: fleetActionTypes.SET_FLEET_HISTORIC, payload: []});
            } else {
                return store.dispatch({type: fleetActionTypes.SET_FLEET, payload: []});
            }
        }

        let fleetData;

        if (payload.historic) {
            fleetData = (store.getState().fleet && store.getState().fleet.fleetHistoric && store.getState().fleet.fleetHistoric.data) ? store.getState().fleet.fleetHistoric.data : [];
        } else {
            fleetData = (store.getState().fleet && store.getState().fleet.fleet && store.getState().fleet.fleet.data) ? store.getState().fleet.fleet.data : [];
        }

        if (data.results) {
            fleetData = fleetData.concat(data.results);
        }

        const result = {
            amount: fleetData.length,
            data: fleetData,
            gotAllData: !!(data.gotAllData || payload.noPagination),
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

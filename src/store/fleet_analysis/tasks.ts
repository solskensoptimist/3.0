import {store} from 'store';
import {request} from 'helpers';
import {fleetAnalysisActionTypes} from './actions';

/**
 * Fetch fleet.
 *
 * @param payload.koncern - bool - If we want fleet for koncern.
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
            store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET, payload: {}});
        }

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
            url: '/fleet/' + payload.prospectId,
        });

        if (!data || data instanceof Error || !data.results) {
            console.log('No data in getFleet', data);
            return store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET, payload: []});
        }

        const result = {
            amount: data.results.length,
            data: data.results,
            gotAllData: data.gotAllData,
            target: payload.prospectId,
            total: data.total,
        };

        return store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET, payload: result});
    } catch (err) {
        return console.error('Error in getFleet:\n' + err);
    }
};

import {store} from 'store';
import {prospectHelper, request} from 'helpers';
import {supertempActionTypes} from './actions';
import moment from 'moment';

/**
 * Retrieve data for a supertemp  subscription.
 *
 * Users have different widget settings/objects saved in mongo collection 'dashboard'.
 * When these widgets have type 'monitorList' its a supertemp subscription.
 * We use search criterias from that widget object to make a search and then we save the result on the id for that widget object.
 * A user can have multiple supertemp subscriptions, so every search result is saved to its unique id.
 *
 * @param payload.criterias
 * @param payload.id
 */
export const getSupertempData = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getSupertempData:\n' + payload);
        }

        // Format criterias for backend.
        const criterias = prospectHelper.getSearchVariables(payload.criterias);
        criterias.pageSize = 25;
        criterias.sort = {
            type: 'published',
            direction: 'DESC'
        };

        // Do a search for results.
        let data = await request({
            data: criterias,
            method: 'post',
            url: '/prospect/car/',
        });

        if (!data || data instanceof Error) {
            return console.error('Could not get data in getSupertempData:\n' + data);
        }

        const result : any = {id: payload.id, data: {
                items: data.data,
                total: data.total
            },
        };

        // New criterias for search latest 24 h.
        let latestBatchCriterias = JSON.parse(JSON.stringify(criterias));
        delete latestBatchCriterias.page;
        delete latestBatchCriterias.search;
        delete latestBatchCriterias.sort;
        latestBatchCriterias.diverse.supertempInterval = {
            from: moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
        };

        result.data.latestBatch = await request({
            data: latestBatchCriterias,
            method: 'post',
            url: '/prospect/numberOfResults/',
        });

        return store.dispatch({ type: supertempActionTypes.SET_SUPERTEMP, payload: result});
    } catch(err) {
        return console.error('Error in getSupertempData:\n' + err);
    }
};

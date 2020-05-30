import {store} from 'store';
import {request} from 'helpers';
import {companyActionTypes} from './actions';

/**
 * Retrieve company information.
 *
 * @param payload.id
 */
export const getCompany = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getCompany');
        }

        const company = await request({
            method: 'get',
            url: '/company/' + payload.id,
        });

        if (!company || company instanceof Error) {
            console.error('No data in getCompany', company);
            return store.dispatch({ type: companyActionTypes.SET_COMPANY, payload: {}});
        }

        await store.dispatch({ type: companyActionTypes.SET_COMPANY, payload: company});
        return;
    } catch(err) {
        return console.error('Error in getCompany:', err);
    }
};

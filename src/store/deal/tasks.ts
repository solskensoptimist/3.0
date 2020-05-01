import {store} from 'store';
import {request} from 'helpers';
import {dealActionTypes} from './actions';
import companyHelper from 'shared_helpers/company_helper';

/**
 * Retrieve one deal.
 */
export const getDeal = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getDeal');
        }

        // Get deal info.
        const deal = await request({
            method: 'get',
            url: '/deals/' + payload.id,
        });

        if (!deal || deal instanceof Error) {
            console.error('No data in getDeal');
            return store.dispatch({ type: dealActionTypes.SET_DEAL, payload: {}});
        }

        // Get list name.
        const list = await request({
            method: 'get',
            url: '/lists/' + deal.meta.moved_from_list,
        });
        const listName = (list && !(list instanceof Error)) ? list.name : '';

        // Get prospects info.
        const prospectInfo = await getProspectInfo({ids: deal.prospects});

        store.dispatch({ type: dealActionTypes.SET_DEAL, payload: deal});
        store.dispatch({ type: dealActionTypes.SET_LIST_NAME, payload: listName});
        return store.dispatch({ type: dealActionTypes.SET_PROSPECT_INFO, payload: prospectInfo});
    } catch(err) {
        return console.error('Error in getDeal:', err);
    }
};

/**
 * Get prospect data for a list of ids, both persons and companies.
 * Returns a list with objects mapped for component rendering.
 *
 * @param payload.ids
 */
const getProspectInfo = async (payload) => {
    if (!payload || (payload && !payload.ids) || (payload && payload.ids && payload.ids.length === 0)) {
        return;
    }

    const prospectPromises = payload.ids.map((id) => {
        if (companyHelper.isValidOrgNr(id)) {
            return request({
                method: 'get',
                url: '/company/' + id,
            })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
        } else {
            return request({
                method: 'get',
                url: '/privatePerson/' + id,
            })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
        }
    });

    const data = await Promise.all(prospectPromises);

    const prospectInfo: Array<object> = [];

    data.map((num: any) => {
        if (num.hasOwnProperty('person')) {
            return prospectInfo.push({
                address: num.person.address,
                name: num.person.name,
                gender: num.person.gender,
                zip: num.person.zip,
                zipMuncipality: num.person.zipMuncipality,
            });
        } else if (num.hasOwnProperty('company')) {
            return prospectInfo.push({
                address: num.company.address,
                name: num.company.name,
                gender: num.company.gender,
                zip: num.company.zip,
                zipMuncipality: num.company.zipMuncipality,
            });
        }
    });

    return prospectInfo;
};

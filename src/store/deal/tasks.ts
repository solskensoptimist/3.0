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
        return [];
    }

    // No really ideal, company reteurns a lot of redundant information. But we use the end points we have atm.
    const prospectPromises = await payload.ids.map(async (id) => {
        if (companyHelper.isValidOrgNr(id)) {
            return await request({
                method: 'get',
                url: '/company/' + id,
            });
        } else {
            return await request({
                method: 'get',
                url: '/privatePerson/' + id,
            });
        }
    });

    const data = await Promise.all(prospectPromises);

    let prospectInfo = data.map((num: any) => {
        if (num.person && num.person.length) {
            return {
                address: num.person[0].person.address ? num.person[0].person.address : '',
                gender: num.person[0].person.gender ? num.person[0].person.gender : '',
                id: num.person[0].id ? num.person[0].id : '',
                name: num.person[0].person.name? num.person[0].person.name : '',
                type: 'person',
                zip: num.person[0].person.zip ? num.person[0].person.zip : '',
                zipMuncipality: num.person[0].person.zipMuncipality ? num.person[0].person.zipMuncipality : '',
            };
        } else if (num.company) {
            return {
                address: num.company.address ? num.company.address : '',
                id: num.company.user_id ? num.company.user_id : '',
                name: num.company.name ? num.company.name : '',
                parentCompany: num.company.parentCompanyId ? num.company.parentCompanyId : '',
                type: 'company',
                zip: num.company.zip ? num.company.zip : '',
                zipMuncipality: num.company.zipMuncipality ? num.company.zipMuncipality : '',
            };
        } else {
            return false;
        }
    });

    prospectInfo = prospectInfo.sort((a: any, b: any) => {
        if ( a.name < b.name){
            return -1;
        } else if ( a.name > b.name ){
            return 1;
        } else {
            return 0;
        }
    });

    return prospectInfo;
};

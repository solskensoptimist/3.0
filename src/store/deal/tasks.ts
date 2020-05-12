import {store} from 'store';
import {prospectHelper, request} from 'helpers';
import {dealActionTypes} from './actions';
import companyHelper from 'shared_helpers/company_helper';

/**
 * Remove a prospect from deal.
 *
 * @payload.ids
 */
export const addProspects = async (payload) => {
    try  {
        if (!payload || !payload.ids || (payload.ids && !payload.ids.length)) {
            return console.error('Missing params in addProspects');
        }

        payload.ids.map((num) => num.id);

        // Hämta deal objekt, addera payload.ids till prospects och try await updateDeal();
        return true;
    } catch (err) {
        return console.error('Error in addProspects:\n' + err);
    }
};

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
    try {
        if (!payload || (payload && !payload.ids) || (payload && payload.ids && payload.ids.length === 0)) {
            return [];
        }

        // This endpoint is slow and does a lot of redundant stuff for what we want here, new end point is coming...
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

        if (!data) {
            console.error('Error in getProspectInfo');
            return [];
        }

        let prospectInfo = data.map((num: any) => {
            if (num.person && num.person.length) {
                const person = num.person[0].person;
                let name;
                if (!person.name || person.name === '') {
                    name = prospectHelper.buildPersonDefaultName(person.gender, person.birthYear);
                } else {
                    name = person.name;
                }

                return {
                    address: person.address ? person.address : '',
                    gender: person.gender ? person.gender : '',
                    id: num.person[0].id ? num.person[0].id : '',
                    name: name,
                    type: 'person',
                    zip: person.zip ? person.zip : '',
                    zipMuncipality: person.zipMuncipality ? person.zipMuncipality : '',
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
    } catch (err) {
        console.error('Error in getProspectInfo.\n' + err);
        return [];
    }
};

/**
 * Remove a prospect from deal.
 *
 * @payload.id
 */
export const removeProspect = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in removeProspect.');
        }
        console.log('removeProspect', payload);
        // Hämta deal objekt, filtrera bort id från prospects och try await updateDeal();
        return true;
    } catch (err) {
        return console.error('Error in removeProspect:\n' + err);
    }
};

/**
 * Update a deal.
 *
 * @param payload - Deal object.
 */
export const updateDeal = async (payload) => {
    try {
        if (!payload || (payload && !payload._id)) {
            return console.error('Missing params in updateDeal');
        }
        console.log('updateDeal', payload);


        /*
        Kolla vad som sker på frontend i 2.0, men i princip ska vi skicka detta:

        req.body {
            id: '5ea98dae085c6bbfa842e860',
                properties: {
                prospects: [ [Object], [Object], [Object] ],
                contacts: [ [Object] ],
                cars: [],
                comments: null,
                maturity: 3,
                name: null,
                description: 'Beskrivning av affär',
                potential: '10',
                files: [ [Object] ],
                id: '5ea98dae085c6bbfa842e860'
            }
        }

        files ser ut såhär:[
          {
            s3_filename: '6348f74c-d304-44e3-a9d7-2821c3898b0e_Prospektera_old.png',
            original_name: 'Prospektera_old.png'
          }
        ]
        */

    } catch (err) {
        return console.error('Error in updateDeal:\n' + err);
    }
};

import {store} from 'store';
import {prospectHelper, request, tc} from 'helpers';
import {dealActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import companyHelper from 'shared_helpers/company_helper';
import _ from 'underscore';

/**
 * Retrieve one deal.
 *
 * @param payload.id - string
 * @param payload.noProspectInfo - bool (mostly used after a deal update)
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
            showFlashMessage(tc.couldNotGetDeal);
            console.error('No data in getDeal');
            return store.dispatch({ type: dealActionTypes.SET_DEAL, payload: {}});
        }

        // Set deal, before getting complementary information.
        store.dispatch({ type: dealActionTypes.SET_DEAL, payload: deal});

        // Get list name.
        if (deal.meta && deal.meta.moved_from_list && deal.meta.moved_from_list.length) {
            const list = await request({
                method: 'get',
                url: '/lists/getList/' + deal.meta.moved_from_list,
            });
            const listName = (list && !(list instanceof Error)) ? list.name : '';
            store.dispatch({ type: dealActionTypes.SET_LIST_NAME, payload: listName});
        }

        // Get prospects info.
        if (!payload.noProspectInfo) {
            const prospectInfo = await getProspectInfo({ids: deal.prospects});
            store.dispatch({ type: dealActionTypes.SET_PROSPECT_INFO, payload: prospectInfo});
        }

       return;
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
                    url: '/company/companyBasicInfo/' + id,
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
            } else {
                return {
                    address: num.address ? num.address : '',
                    id: num.user_id ? num.user_id : '',
                    name: num.name ? num.name : '',
                    parentCompany: num.parentCompanyId ? num.parentCompanyId : '',
                    type: 'company',
                    zip: num.zip ? num.zip : '',
                    zipMuncipality: num.zipMuncipality ? num.zipMuncipality : '',
                };
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
 * Update a deal.
 *
 * All properties optional.
 * (We do not include deal.comments - as far as I can tell it's a deprecated property. Same with deal.contacts.)
 *
 * @param payload.cars - array
 * @param payload.description - string
 * @param payload.files - array
 * @param payload.maturity- number
 * @param payload.name - string
 * @param payload.potential - string
 * @param payload.prospects - array
 * @param payload.user_id - number
 */
export const updateDeal = async (payload) => {
    try {
        if (!payload) {
            return console.error('Missing params in updateDeal');
        }

        const dealInScope = store.getState().deal.deal;
        const params: any = {};
        let promises = [];

        // Cars
        if (payload.hasOwnProperty('cars')) {
            params.cars = payload.cars;
            if (params.cars.length) {
                params.cars = params.cars.sort((a: string, b: string) => {
                    if ( a < b){
                        return -1;
                    } else if ( a > b ){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                params.cars = _.uniq(params.cars, true);
            }
        }

        // Files.
        if (payload.hasOwnProperty('files')) {
            params.files = payload.files;
        }

        // Description.
        if (payload.hasOwnProperty('description')) {
            params.description = payload.description;
        }
        // Maturity.
        if (payload.hasOwnProperty('maturity')) {
            params.maturity = payload.maturity;
        }

        // Name.
        if (payload.hasOwnProperty('name')) {
            params.name = payload.name;
        }

        // Potential.
        if (payload.hasOwnProperty('potential')) {
            params.potential = payload.potential;
        }

        // Prospects.
        if (payload.hasOwnProperty('prospects')) {
            params.prospects = payload.prospects;
            if (params.prospects.length) {
                params.prospects = params.prospects.map((num) => num.toString());
                params.prospects = _.uniq(params.prospects);
            }
        }

        // Deal owner.
        if (payload.hasOwnProperty('user_id') && payload.user_id.length) {
            // Adjust updated deal obj.
            params.prev_user_id = Number(dealInScope.user_id);
            params.user_id = Number(payload.user_id);

            // When deal owner changes, we need to create a deal action.
            promises = promises.concat(
                await request({
                    data: {
                        action: 'owner',
                        dealId: dealInScope._id,
                        prevUserId: dealInScope.user_id,
                        user_id: payload.user_id,
                        moved: true,
                    },
                    method: 'post',
                    url: '/deals/actions',
                })
            );
        }

        // Add promise for actual deal update.
        promises = promises.concat(
            await request({
                data: {
                    id: dealInScope._id,
                    properties: params,
                },
                method: 'put',
                url: '/deals'
            })
        );

        // All set, lets resolve promises.
        const data = await Promise.all(promises);

        if (!data) {
            return console.error('Error in updateDeal, promise chain fail.');
        }

        if (payload.prospects && payload.prospects.length) {
            await getDeal({id: dealInScope._id});
            return showFlashMessage(tc.dealWasUpdated);
        } else {
            // Retrieving prospect info is somewhat slow, so try and avoid when unnecessary.
            await getDeal({id: dealInScope._id, noProspectInfo: true});
            return showFlashMessage(tc.dealWasUpdated);
        }
    } catch (err) {
        return console.error('Error in updateDeal:\n' + err);
    }
};

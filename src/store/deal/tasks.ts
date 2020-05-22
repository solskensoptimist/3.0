import {store} from 'store';
import {prospectHelper, request} from 'helpers';
import {dealActionTypes} from './actions';
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
 * Update a deal.
 *
 * All properties optional.
 * Note that we have to do extra backend calls depending on what to update.
 * (We do not include deal.comments - as far as I can tell it's a deprecated property.)
 *
 * @param payload.carsToAdd - For cars add, use this property.
 * @param payload.carsToRemove - For cars remove, use this property.
 * @param payload.description
 * @param payload.filesToAdd - For files add, use this property.
 * @param payload.filesToRemove - For files remove, use this property.
 * @param payload.contactsToAdd - For contacts add, use this property.
 * @param payload.contactsToRemove - For contacts remove, use this property.
 * @param payload.maturity
 * @param payload.name
 * @param payload.potential
 * @param payload.prospectsToAdd - For prospects add, use this property.
 * @param payload.prospectsToRemove - For prospects remove, use this property.
 * @param payload.user_id
 */
export const updateDeal = async (payload) => {
    try {
        if (!payload) {
            return console.error('Missing params in updateDeal');
        }

        store.dispatch({ type: dealActionTypes.SET_DEAL_UPDATING, payload: true});

        const dealInScope = store.getState().deal.deal;
        const params: any = {};
        let promises = [];

        // Add cars.
        if (payload.carsToAdd && payload.carsToAdd.length) {
            params.cars = dealInScope.cars.concat(payload.carsToAdd);

            // Sort and remove duplicates.
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

        // Remove cars.
        if (payload.carsToRemove && payload.carsToRemove.length) {
            params.cars = dealInScope.cars.filter((id) => !payload.carsToRemove.includes(id));

            // Sort and remove duplicates.
            params.cars = params.cars.sort((a: string, b: string) => {
                if ( a < b){
                    return -1;
                } else if ( a > b){
                    return 1;
                } else {
                    return 0;
                }
            });

            params.cars = _.uniq(params.cars, true);
        }

        // Add contacts
        if (payload.contactsToAdd && payload.contactsToAdd.length) {
            // Adjust updated deal obj.
            params.contacts = dealInScope.contacts.concat(payload.contactsToAdd);

            // When adding contacts to deal, we need to update contacts object in mongo collection.
            let contactPromises = await payload.contactsToAdd.map(async (contact) => {
                contact.savedTo.push({
                    entityId: dealInScope._id,
                });

                return await request({
                    data: {
                        contactId: contact._id,
                        updatedData: {
                            savedTo: contact.savedTo
                        }
                    },
                    method: 'put',
                    url: '/contacts'
                });
            });

            promises = promises.concat(contactPromises);
        }

        // Remove contacts.
        if (payload.contactsToRemove && payload.contactsToRemove.length) {
            // Adjust updated deal obj.
            params.contacts = dealInScope.contacts.filter((contact) => !payload.contactsToRemove.find((num) => num._id === contact._id));

            // When removing contacts from deal, we need to update contacts object in mongo collection.
            let contactPromises = await payload.contactsToRemove.map(async (contact) => {
                return await request({
                    data: {
                        contactId: contact._id,
                        entityId: dealInScope._id,
                    },
                    method: 'put',
                    url: '/contacts/removeFromEntity'
                });
            });

            promises = promises.concat(contactPromises);
        }

        // Add files.
        if (payload.filesToAdd && payload.filesToAdd.length) {
            params.files = dealInScope.meta.files.concat(payload.filesToAdd);
        }

        // Remove files.
        if (payload.filesToRemove && payload.filesToRemove.length) {
            params.files = dealInScope.meta.files.filter((file) => !payload.filesToRemove.find((num) => num.s3_filename === file.s3_filename));
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

        // Add prospects.
        if (payload.prospectsToAdd && payload.prospectsToAdd.length) {
            params.prospects = dealInScope.prospects.concat(payload.prospectsToAdd);
            params.prospects = _.uniq(params.prospects);
        }

        // Remove prospects.
        if (payload.prospectsToRemove && payload.prospectsToRemove.length) {
            params.prospects = dealInScope.prospects.filter((id) => !payload.prospectsToRemove.includes(id));
            params.prospects = _.uniq(params.prospects);
        }

        // Deal owner.
        if (payload.user_id) {
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
            store.dispatch({ type: dealActionTypes.SET_DEAL_UPDATING, payload: false});
            return console.error('Error in updateDeal, promise chain fail.');
        }

        store.dispatch({ type: dealActionTypes.SET_DEAL_UPDATING, payload: false});

        if (payload.prospectsToAdd || payload.prospectsToRemove) {
            return await getDeal({id: dealInScope._id});
        } else {
            // Retrieving prospect info is somewhat slow, so try and avoid when unnecessary.
            return await getDeal({id: dealInScope._id, noProspectInfo: true});
        }
    } catch (err) {
        store.dispatch({ type: dealActionTypes.SET_DEAL_UPDATING, payload: false});
        return console.error('Error in updateDeal:\n' + err);
    }
};

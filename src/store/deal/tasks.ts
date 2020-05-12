import {store} from 'store';
import {prospectHelper, request} from 'helpers';
import {dealActionTypes} from './actions';
import companyHelper from 'shared_helpers/company_helper';


/**
 * Retrieve one deal.
 *
 * @payload.id
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
 * Update a deal.
 *
 * Should ONLY hold properties that has changes. I.E. all properties optional.
 * We retrieve id for deal, and other data, from current store.deal.deal object.
 *
 * @param payload.carsToAdd - For cars add, use this property.
 * @param payload.carsToRemove - For cars remove, use this property.
 * @param payload.comments
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

        const currentDeal = store.getState().deal.deal;
        const updatedDeal: any = {};
        let precedingPromises = [];

        // When adding contacts to deal, we need to update contacts object in mongo collection.
        if (payload.contactsToAdd && payload.contactsToAdd.length) {
            // Adjust updated deal obj.
            updatedDeal.contacts = currentDeal.contacts.concat(payload.contactsToAdd);

            // And save backend call in promise.
            let contactPromises = await payload.contactsToAdd.map(async (contact) => {
                contact.savedTo.push({
                    entityId: currentDeal._id,
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

            precedingPromises = precedingPromises.concat(contactPromises);
        }

        // When removing contacts from deal, we need to update contacts object in mongo collection.
        if (payload.contactsToRemove && payload.contactsToRemove.length) {
            // Adjust updated deal obj.
            updatedDeal.contacts = currentDeal.contacts.filter((contact) => !payload.contactsToRemove.find((num) => num._id === contact._id));

            // And save backend call in promise.
            let contactPromises = await payload.contactsToAdd.map(async (contact) => {
                return await request({
                    data: {
                        contactId: contact._id,
                        entityId: currentDeal._id,
                    },
                    method: 'put',
                    url: '/contacts/removeFromEntity'
                });
            });

            precedingPromises = precedingPromises.concat(contactPromises);
        }

        // When deal owner changes, we need to create a deal action.
        if (payload.user_id) {
            // Adjust updated deal obj.
            updatedDeal.prev_user_id = currentDeal.user_id;
            updatedDeal.user_id = payload.user_id;

            // And save backend call in promise.
            precedingPromises.concat(
               await request({
                   data: {
                       action: 'owner',
                       dealId: currentDeal._id,
                       prevUserId: currentDeal.user_id,
                       user_id: payload.user_id,
                       moved: true,
                   },
                   method: 'post',
                   url: '/deals/actions',
               })
            );
        }

        // Adjust remaining properties.
        if (payload.carsToAdd) {
            updatedDeal.cars = currentDeal.cars.concat(payload.carsToAdd);
        }

        if (payload.carsToRemove) {
            updatedDeal.cars = currentDeal.cars.filter((car) => !payload.carsToRemove.find((num) => num.id === car.id));
        }

        if (payload.filesToAdd) {
            updatedDeal.files = currentDeal.meta.files.concat(payload.filesToAdd);
        }

        if (payload.filesToRemove) {
            updatedDeal.files = currentDeal.meta.files.filter((file) => !payload.filesToRemove.find((num) => num.s3_filename === file.s3_filename));
        }

        if (payload.prospectsToAdd) {
            updatedDeal.prospects = currentDeal.prospects.concat(payload.prospectsToAdd);
        }

        if (payload.prospectsToRemove) {
            updatedDeal.prospects = currentDeal.prospects.filter((id) => !payload.prospectsToRemove.includes(id));
        }

        updatedDeal.cars = updatedDeal.cars ? updatedDeal.cars : currentDeal.cars;
        updatedDeal.comments = payload.comments ? payload.comments : currentDeal.comments;
        updatedDeal.description = payload.description ? payload.description : currentDeal.description;
        updatedDeal.files = updatedDeal.files ? updatedDeal.files : currentDeal.meta.files;
        updatedDeal.id = currentDeal._id;
        updatedDeal.maturity = payload.maturity ? payload.maturity : currentDeal.maturity;
        updatedDeal.name = payload.name || currentDeal.name || null;
        updatedDeal.potential = payload.potential ? payload.potential : currentDeal.potential;
        updatedDeal.prospects = updatedDeal.prospects ? updatedDeal.prospects : currentDeal.prospects;

        // Lets resolve the first set of promises.
        const data = await Promise.all(precedingPromises);

        if (!data) {
            return console.error('Could not update deal, preceding promises');
        }

        // Actual update of deal.
        const deal = await request({
            data: {
                id: currentDeal._id,
                properties: updatedDeal,
            },
            method: 'put',
            url: '/deals'
        });

        if (!deal) {
            return console.error('Could not update deal');
        }

        return await getDeal({id: currentDeal._id});
    } catch (err) {
        return console.error('Error in updateDeal:\n' + err);
    }
};

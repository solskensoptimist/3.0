import {store} from 'store';
import {request, requestWithBody, tc} from 'helpers';
import {contactsActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';

/**
 * Add an entity to contacts 'savedTo' array.
 *
 * @param payload.companyId - string - When type is car or company, we want a value here.
 * @param payload.contacts - Array - Contacts that will receive new entity.
 * @param payload.entityId - string - The entity.
 * @param payload.entityType - string - 'car' / 'company' / 'deal'
 */
export const addEntityToContacts = async (payload) => {
    try {
        if (!payload || (payload && !payload.contacts) || (payload && !payload.entityId) || (payload && !payload.type)) {
            return console.error('Missing params in addEntityToContact.');
        }

        const promises = await payload.contacts.map(async (contact) => {
            if (!contact.savedTo || (contact.savedTo && !Array.isArray(contact.savedTo))) {
                contact.savedTo = [];
            }

            let entity: any = {
                companyId: payload.companyId,
                entityId: payload.entityId,
                entityType: payload.entityType,
            };

            if (payload.type === 'car') {
                entity.entityName = (payload.entityName) ? payload.entityName : contact.entityId;
            }

            if (payload.entityType === 'company' && !payload.entityName) {
                throw new Error('Mssing entityName for entityType company in addEntitToContacts.');
            }

            if (payload.entityType === 'company') {
                entity.entityName = payload.entityName;
            }

            contact.savedTo.push(entity);

            return await request({
                data: {
                    contactId: contact._id,
                    updatedData: contact,
                },
                method: 'put',
                url: '/contacts/',
            });
        });

        const data = await Promise.all(promises);

        if (!data) {
            return console.error('Error in addEntityToContacts');
        }

        showFlashMessage(tc.entityWasAddedToContact);

        return await getContacts({entityId: payload.entityId});
    } catch (err) {
        return console.error('Error in addEntityToContact:\n' + err);
    }
};

/**
 * Get contacts for a specific entityId, which can be: a company org nr/a car reg nr/a deal id.
 *
 * @param payload.entityId - string
 */
export const getContacts = async (payload) => {
    try {
        if (!payload || (payload && !payload.entityId)) {
            return console.error('Missing params in getContacts.');
        }

        let data: any = {};
        if (companyHelper.isValidOrgNr(payload.entityId)) {
            data.companyId = payload.entityId;
        } else {
            data.entityId = payload.entityId;
        }

        // Get contacts.
        let contacts = await request({
            data: data,
            method: 'get',
            url: '/contacts/',
        });

        // Make sure to clear out faulty values.
        contacts = contacts.filter((num) => num);

        store.dispatch({type: contactsActionTypes.SET_ENTITY_ID, payload: payload.entityId});

        if (!contacts || contacts instanceof Error) {
            return store.dispatch({type: contactsActionTypes.SET_CONTACTS, payload: []});
        } else {
            return store.dispatch({type: contactsActionTypes.SET_CONTACTS, payload: contacts});
        }
    } catch (err) {
        return console.error('Error in getContacts:\n' + err);
    }
};

/**
 * Remove a contact completely.
 *
 * @param payload.id - string - Contact id.
 */
export const removeContact = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in removeContact.');
        }

        const deletedContact = await request({
            data: {
                contactId: payload.id,
            },
            method: 'delete',
            url: '/contacts/',
        });

        if (!deletedContact) {
            return console.error('Error in removeContact.');
        }

        showFlashMessage(tc.contactWasRemoved);

        if (store.getState().contacts && store.getState().contacts.entityId) {
            return await getContacts({entityId: store.getState().contacts.entityId});
        }
    } catch (err) {
        return console.error('Error in removeContact:\n' + err);
    }
};

/**
 * Remove an entity (company/deal/car) from contacts 'savedTo' array.
 * Contact is not removed, even if the savedTo array becomes empty.
 *
 * @param payload.entityId - string
 * @param payload.id - string
 */
export const removeEntityFromContact = async (payload) => {
    try {
        if (!payload || (payload && !payload.id) || (payload && !payload.entityId)) {
            return console.error('Missing params in removeEntityFromContact.');
        }

        const updated = await requestWithBody({
            data: {
                contactId: payload.id,
                entityId: payload.entityId
            },
            method: 'delete',
            url: '/contacts/removeFromEntity',
        });

        if (!updated) {
            return console.error('Error in removeEntityFromContact.');
        }

        showFlashMessage(tc.entityWasRemovedFromContact);

        return await getContacts({entityId: payload.entityId});
    } catch (err) {
        return console.error('Error in removeEntityFromContact:\n' + err);
    }
};

/**
 * Save a new contact.
 *
 * Note:
 * 'savedTo' array holds entity objects with the properties below.
 * An entity can be a car, company or deal. It's not possible to save a contact to a person, but you can save a contact to a car where the user is a person.
 * companyId - for company this is the company org nr, but if company is part of a koncern it should be koncern org nr / for car we save user id for the vehicle here / for deal we don't save companyId.
 * entityType - 'deal' / 'company' / 'car'.
 * entityId - company org nr / deal id / car reg nr.
 * entityName - company name / car name (brand, model and reg nr, example: 'DAF CF (EAD349)'), or just reg nr / for deals we don't save entityName.
 *
 *
 * @param payload.comment - string
 * @param payload.email - array
 * @param payload.name - string
 * @param payload.savedTo - array
 * @param payload.tele - array
 */
export const saveNewContact = async (payload) => {
    try {
        if (!payload) {
            return console.error('Missing params in saveNewContact.');
        }

        // Add properties to entity objects where missing.
        if (payload.savedTo && payload.savedTo.length) {
            payload.savedTo.map((num) => {
                if (!num.entityId) {
                    throw new Error('Missing entityId for entity in saveNewContact.');
                }

                if (carHelper.isValidRegNumber(num.entityId)) {
                    // Car
                    if (!num.companyId) {
                        throw new Error('Missing companyId for entityType "car" in saveNewContact.');
                    }
                    if (!num.entityType) {
                        num.entityType = 'car';
                    }
                    if (!num.entityName) {
                        num.entityName = num.entityId;
                    }
                } else if (companyHelper.isValidOrgNr(num.entityId)) {
                    // Company
                    if (!num.entityName) {
                        throw new Error('Missing entityName for entityType "company" in saveNewContact');
                    }
                    if (!num.entityType) {
                        num.entityType = 'company';
                    }
                    if (!num.companyId) {
                        num.companyId = num.entityId;
                    }
                } else {
                    // Deal
                    num.entityType = 'deal';
                }

                return num;
            });
        }

        if (!payload.tele || !Array.isArray(payload.tele)) {
            payload.tele = []; // 2.0 frontend breaks if tele array doesn't exist.
        }

        const contact = await request({
            data: payload,
            method: 'post',
            url: '/contacts',
        });

        if (!contact) {
            return console.error('Error in saveNewContact.');
        }

        showFlashMessage(tc.contactWasSaved);

        if (store.getState().contacts && store.getState().contacts.entityId) {
            return await getContacts({entityId: store.getState().contacts.entityId});
        }
    } catch (err) {
        return console.error('Error in saveNewContact:\n' + err);
    }
};


/**
 * Update a new contact
 *
 * @param payload.id - string - Id for contact.
 *
 * @param payload.data.comment - string
 * @param payload.data.email - array
 * @param payload.data.name - string
 * @param payload.data.savedTo - array
 * @param payload.data.tele - array
 */
export const updateContact = async (payload) => {
    try {
        if (!payload || !payload.id || !payload.data) {
            return console.error('Missing params in updateContact.');
        }

        const updated = await request({
            data: {
                contactId: payload.id,
                updatedData: payload.data
            },
            method: 'put',
            url: '/contacts/',
        });

        if (!updated) {
            return console.error('Error in updateContact');
        }

        showFlashMessage(tc.contactWasUpdated);

        if (store.getState().contacts && store.getState().contacts.entityId) {
            return await getContacts({entityId: store.getState().contacts.entityId});
        }
    } catch (err) {
        return console.error('Error in updateContact:\n' + err);
    }
};

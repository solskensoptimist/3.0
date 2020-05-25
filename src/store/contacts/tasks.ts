import {store} from 'store';
import {request} from 'helpers';
import {contactsActionTypes} from './actions';
import companyHelper from 'shared_helpers/company_helper';

/**
 * Add a target to contacts 'savedTo' array.
 *
 * @param payload.ids - Array - Contact ids.
 * @param payload.target - string - Target.
 */
export const addTargetToContacts = async (payload) => {
    try {
        if (!payload || (payload && !payload.ids) || (payload && !payload.target)) {
            return console.error('Missing params in addTargetToContact.');
        }

        // Kom ihåg att göra en checkpå target om det är valid org nr, kanske även någon check på om det är fler än 12 tecken.
        // Vi ska ju ange entityType 'company' eller 'deal'. Kolla upp att detta är de enda två typerna vi har i db.

        // Iterera payload.ids, detta är id för varje kontakt som ska få entityId och entityType i sin 'savedTo' array.

        // Om det gäller deal så ska vi även uppdatera deal-objektets contacts-array.. sker detta på backend eller krävs ett separat anrop?
        // Kolla upp.

        console.log('addTargetToContact');

        // return await getContacts({target: payload.target});
    } catch (err) {
        return console.error('Error in addTargetToContact:\n' + err);
    }
};

export const deleteContact = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in deleteContact.');
        }

        console.log('deleteContact');

        // if (store.getState().contacts && store.getState().contacts.target) {
        // Om vi har arget i denna funktion ska vi använda payload.target istället
        //     return await getContacts({target: store.getState().contacts.target});
        // }
    } catch (err) {
        return console.error('Error in deleteContact:\n' + err);
    }
};


/**
 * Get contacts for target.
 *
 * @param payload.target - string - Company orgnr or a deal id.
 */
export const getContacts = async (payload) => {
    try {
        if (!payload || (payload && !payload.target)) {
            return console.error('Missing params in getContacts.');
        }

        let data: any = {};
        if (companyHelper.isValidOrgNr(payload.target)) {
            data.companyId = payload.target;
        } else {
            data.entityId = payload.target;
        }

        // Get contacts.
        const contacts = await request({
            data: data,
            method: 'get',
            url: '/contacts/',
        });

        store.dispatch({type: contactsActionTypes.SET_TARGET, payload: payload.target});

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

        console.log('removeContact');

        // Om det kontakt finns i  deal så ska vi även uppdatera deal-objektets contacts-array.. sker detta på backend eller krävs ett separat anrop?
        // Kolla upp.

// if (store.getState().contacts && store.getState().contacts.target) {
        // Om vi har arget i denna funktion ska vi använda payload.target istället
        //     return await getContacts({target: store.getState().contacts.target});
        // }
    } catch (err) {
        return console.error('Error in removeContact:\n' + err);
    }
};

/**
 * Remove a target from contact 'savedTo' array,
 *
 * @param payload.id - string - Contact id.
 * @param payload.target - string - Target.
 */
export const removeTargetFromContact = async (payload) => {
    try {
        if (!payload || (payload && !payload.id) || (payload && !payload.target)) {
            return console.error('Missing params in removeTargetFromContact.');
        }

        // Om det gäller deal så ska vi även uppdatera deal-objektets contacts-array.. sker detta på backend eller krävs ett separat anrop?
        // Kolla upp.

        console.log('removeTargetFromContact');

        // return await getContacts({target: payload.target});
    } catch (err) {
        return console.error('Error in removeTargetFromContact:\n' + err);
    }
};

/**
 * Save a new contact
 *
 * @param payload.comment - string
 * @param payload.tele - array
 * @param payload.email - array
 * @param payload.name - string
 * @param payload.savedTo - string
 * @param payload.tele - array
 * @param payload.target - string - Orgnr or deal id.
 */
export const updateContact = async (payload) => {
    try {
        if (!payload || Object.keys(payload).length === 0) {
            return console.error('Missing params in updateContact.');
        }

        console.log('updateContact');

        // EXEMPEL, allt behöver inte skickas med väl..?
        // req.body {
        //     contactId: '5d7a1da75b4af56b3953b598',
        //     updatedData: {
        //         name: 'Patrik Forslund2',
        //         email: [ 'patrik.forslund@bilvision.se', 'patrik.forslund@bilvision.se2' ],
        //         tele: [ '031-3821710', '031-123456789' ],
        //         comment: 'Beskrivning',
        //         savedTo: [ [Object], [Object], [Object] ],
        //         userId: 7305,
        //         dealerId: 5141,
        //         updated: '2019-10-04T12:48:41.076Z'
        //     }
        // }


        const data = await request({
            data: {
                contactId: 'hej',
                updatedData: payload
            },
            method: 'put',
            url: '/contacts/',
        });

        // if (store.getState().contacts && store.getState().contacts.target) {
        //      Om vi har arget i denna funktion ska vi använda payload.target istället
    //      return await getContacts({target: store.getState().contacts.target});
        // }
    } catch (err) {
        return console.error('Error in updateContact:\n' + err);
    }
};

export const saveNewContact = async (payload) => {
    try {
        if (!payload || (payload && !payload.target)) {
            return console.error('Missing params in saveNewContact.');
        }
        // Kom ihåg att göra en checkpå target om det är valid org nr, kanske även någon check på om det är fler än 12 tecken.
        // Vi ska ju ange entityType 'company' eller 'deal'. Kolla upp att detta är de enda två typerna vi har i db.

        /*
        Kolla upp hur kontakter sparas... oklart om ovanstående params är korrekta...
         */

        // Om target är deal så ska även deal-objekjtet uppdateras. Sker detta på backend eller krävs separat anrop?

        console.log('saveNewContact');

// if (store.getState().contacts && store.getState().contacts.target) {
        // Om vi har arget i denna funktion ska vi använda payload.target istället
        //     return await getContacts({target: store.getState().contacts.target});
        // }
    } catch (err) {
        return console.error('Error in saveNewContact:\n' + err);
    }
};

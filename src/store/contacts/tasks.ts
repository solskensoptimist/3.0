import {store} from 'store';
import {request} from 'helpers';
import {contactsActionTypes} from './actions';

/**
 * Add a target to contacts 'savedTo' array.
 *
 * @payload.ids - Array - Contact ids.
 * @payload.target - string - Target.
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

/**
 * Get contacts for target.
 *
 * @payload.target - string - Orgnr or deal id.
 */
export const getContacts = async (payload) => {
    try {
        if (!payload || (payload && !payload.target)) {
            return console.error('Missing params in getContacts.');
        }

        console.log('getContacts');

        // Var / hur hämtar vi contacts..?

        store.dispatch({type: contactsActionTypes.SET_TARGET, payload: payload.id});
        return store.dispatch({type: contactsActionTypes.SET_CONTACTS, payload: []});
    } catch (err) {
        return console.error('Error in getContacts:\n' + err);
    }
};

/**
 * Remove a contact completely.
 *
 * @payload.id - string - Contact id.
 */
export const removeContact = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in removeContact.');
        }

        console.log('removeContact');

        // Om det kontakt finns i  deal så ska vi även uppdatera deal-objektets contacts-array.. sker detta på backend eller krävs ett separat anrop?
        // Kolla upp.

        // return await getContacts({target: store.getState().contacts.target});
    } catch (err) {
        return console.error('Error in removeContact:\n' + err);
    }
};

/**
 * Remove a target from contact 'savedTo' array,
 *
 * @payload.id - string - Contact id.
 * @payload.target - string - Target.
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
 * @payload.comment - string
 * @payload.tele - array
 * @payload.email - array
 * @payload.name - string
 * @payload.tele - array
 * @payload.target - string - Orgnr or deal id.
 */
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

        // return await getContacts({target: payload.target});
    } catch (err) {
        return console.error('Error in saveNewContact:\n' + err);
    }
};

// import {store} from 'store';
import {request, tc} from 'helpers';
// import {agileActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addEntityToContacts} from 'store/contacts/tasks';

/**
 * Create a deal
 *
 * @param payload.cars
 * @param payload.contacts
 * @param payload.description
 * @param payload.files
 * @param payload.maturity
 * @param payload.prospects
 * @param payload.user_id
 */
export const createDeal = async (payload) => {
    try {
        const data = await request({
            data: {
                cars: payload.cars ? payload.cars : [],
                comments: '', // Deprecated property
                contacts: [], // Deprecated property
                description: payload.description ? payload.description : '',
                files: payload.files ? payload.files : [],
                maturity: payload.maturity ? payload.maturity : null,
                name: payload.name ? payload.name : null,
                phase: 'idle',
                prospects: payload.prospects ? payload.prospects : [],
                responsible: payload.responsible ? payload.responsible : null,
            },
            method: 'post',
            url: '/deals/',
        });

        if (!data || data instanceof Error) {
            showFlashMessage(tc.couldNotCreateDeal);
            console.error('Could not create deal:\n' + data);
        }

        // If contacts was provided, add deal id to these contacts.
        if (payload.contacts && payload.contacts.length && data._id) {
            await addEntityToContacts({
                contacts: payload.contacts,
                entityId: data._id,
                entityType: 'deal',
            })
        }

        return showFlashMessage(tc.dealWasCreated);
    } catch(err) {
        return console.error('Error in createDeal:\n' + err);
    }
};

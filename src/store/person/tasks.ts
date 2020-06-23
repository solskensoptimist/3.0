import {store} from 'store';
import {prospectHelper, request, tc} from 'helpers';
import {personActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';

/**
 * Retrieve person information.
 *
 * @param payload.id
 */
export const getPerson = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getPerson:\n' + payload);
        }

        const person = [await request({
            method: 'get',
            url: '/privatePerson/' + payload.id,
        })];

        const responsible = [await request({
            method: 'get',
            url: '/responsibility/' + payload.id,
        })];

        const deals = [await request({
            method: 'get',
            url: '/deals/prospect/' + payload.id,
        })];

        const data = await Promise.all(person.concat(responsible, deals));

        if (!data || data instanceof Error || !data.length) {
            console.error('No data in getPerson', data);
            store.dispatch({ type: personActionTypes.SET_PERSON, payload: {}});
            store.dispatch({ type: personActionTypes.SET_PERSON_RESPONSIBLE, payload: {}});
            return store.dispatch({ type: personActionTypes.SET_PERSON_DEALS, payload: []});
        }

        let resultPerson = (data[0].person && data[0].person[0]) ? data[0].person[0] : {};
        const resultResponsible = (data[1]) ? data[1] : {};
        let resultDeals = (data[2]) ? data[2] : [];

        if (!resultPerson.person.name || !resultPerson.person.name.length) {
            resultPerson.person.name = prospectHelper.buildPersonDefaultName(resultPerson.person.gender, resultPerson.person.birthYear, resultPerson.person.zipMuncipality);
        }

        // Sort deals on name.
        if (resultDeals && resultDeals.length) {
            resultDeals = resultDeals.sort((a: any, b: any) => {
                if (!a.name || a.name.length === 0) {
                    return -1;
                } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else if ( a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }

        store.dispatch({ type: personActionTypes.SET_PERSON, payload: resultPerson});
        store.dispatch({ type: personActionTypes.SET_PERSON_RESPONSIBLE, payload: resultResponsible});
        return store.dispatch({ type: personActionTypes.SET_PERSON_DEALS, payload: resultDeals});
    } catch(err) {
        return console.error('Error in getPerson:\n' + err);
    }
};

/**
 * Set responsible user for person.
 *
 * @param payload.entityId
 * @param payload.responsibleUserId
 */
export const setResponsibility = async (payload) => {
    try {
        if (!payload || (payload && !payload.entityId) || (payload && !payload.responsibleUserId)) {
            return console.error('Missing params in setResponsibility:\n' + payload);
        }

        const data = await request({
            data: {
                entityId: payload.entityId.toString(),
                responsibleUserId: Number(payload.responsibleUserId),
            },
            method: 'post',
            url: '/responsibility/',
        });

        if (data instanceof Error) {
            return console.error('Could not change responsibility:\n' + data);
        }

        return store.dispatch({type: personActionTypes.SET_PERSON_RESPONSIBLE, payload: data});
    } catch (err) {
        return console.error('Error in setResponsibility:\n' + err);
    }
};

/**
 * Toggle GDPR consent regarding a vehicle user for a dealer.
 *
 * @param payload.id - string - Id of vehicle user.
 */
export const toggleConsent = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in toggleConsent.');
        }

        const data = await request({
            data: {
                user_id: payload.id,
            },
            method: 'post',
            url: '/privatePerson/toggleConsent/',
        });

        if (data instanceof Error) {
            return console.error('Could not toggle consent in toggleConsent:\n' + data);
        }

        return store.dispatch({ type: personActionTypes.SET_PERSON_CONSENT, payload: (data === 1)});
    } catch (err) {
        return console.error('Error in toggleConsent:\n' + err);
    }
};
/**
 * Add, edit, remove a persons name, email and phone number information.
 *
 * @param payload.action - string - 'add' | 'delete' | 'edit', always needed.
 * @param payload.id - number - Needed when edit or delete email and phone.
 * @param payload.prospectId - number - TS user id, always needed.
 * @param payload.type - string - 'email' | 'phone' | 'name', always needed.
 * @param payload.value - string - The value.
 */
export const updatePersonInformation = async (payload) => {
    try {
        // Check that params is correct.
        if (!payload || (payload.type !== 'email' && payload.type !== 'phone' && payload.type !== 'name') ||
            !payload.action || !payload.prospectId || !payload.hasOwnProperty('value')) {
            return console.error('Missing params in updatePersonInformation:\n' + payload);
        }
        if ((payload.type === 'email' && payload.type === 'phone') && (payload.action === 'delete' || payload.action === 'edit') && !payload.id) {
            return console.error('Missing params in updatePersonInformation:\n' + payload);
        }

        let existingData;
        if (payload.type === 'email') {
            existingData = store.getState().person.person.emails;
        } else if (payload.type === 'phone') {
            existingData = store.getState().person.person.phoneNumbers;
        }

        if (existingData && !Array.isArray(existingData)) {
            existingData = [];
        }

        // If value already exists, abort.
        if (existingData && existingData.length && existingData.find((num) => (num.value === payload.value))) {
            return showFlashMessage(tc.valueAlreadyExists);
        }

        if (payload.type === 'name') {
            // For name, we delete existing name first, no matter the action.
            const deleteData = await request({
                data: {
                    action: 'deleteInfoByProspectIdAndType',
                    prospectId: payload.prospectId,
                    type: 'name',
                },
                method: 'post',
                url: '/information/delete/',
            });

            if (!deleteData || deleteData instanceof Error) {
                return console.error('Could not delete person name:\n' + deleteData);
            }
        }

        if (payload.action === 'delete' && payload.type === 'name') {
            // If type is 'name' and action 'delete' we are done, we call getPerson to build default name.
            showFlashMessage(tc.changesSaved);
            return getPerson({id: payload.prospectId});
        } else {
            // For everything else we need another backend call.
            const data = await request({
                data: payload,
                method: 'post',
                url: '/information/',
            });

            if (!data ||data instanceof Error) {
                return console.error('Could not update person information:\n' + data);
            }

            // No need to call getPerson(), we adjust data in store state directly to prevent unnecessary backend call.
            if (payload.type !== 'name') {
                if (payload.action === 'add') {
                    existingData.push({
                        id: data[0],
                        value: payload.value,
                    });
                }
                if (payload.action === 'edit') {
                    existingData.map((num) => {
                        if (num.id === payload.id) {
                            num.value = payload.value;
                        }
                        return num;
                    });
                }
                if (payload.action === 'delete') {
                    existingData = existingData.filter((num) => num.id !== payload.id);
                }
            }

            showFlashMessage(tc.changesSaved);

            if (payload.type === 'email') {
                return store.dispatch({type: personActionTypes.SET_PERSON_EMAILS, payload: existingData});
            } else if (payload.type === 'phone') {
                return store.dispatch({type: personActionTypes.SET_PERSON_PHONENUMBERS, payload: existingData});
            } else if (payload.type === 'name') {
                return store.dispatch({type: personActionTypes.SET_PERSON_NAME, payload: payload.value});
            }
        }
    } catch (err) {
        return console.error('Error in updatePersonInformation:\n' + err);
    }
};


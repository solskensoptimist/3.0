import {store} from 'store';
import {prospectHelper, request} from 'helpers';
import {personActionTypes} from './actions';
//import {showFlashMessage} from 'store/flash_messages/tasks';


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
    // try {
    //     if (!payload || (payload && !payload.entityId) || (payload && !payload.responsibleUserId)) {
    //         return console.error('Missing params in setResponsibility:\n' + payload);
    //     }
    //
    //     const data = await request({
    //         data: {
    //             entityId: payload.entityId.toString(),
    //             responsibleUserId: Number(payload.responsibleUserId),
    //         },
    //         method: 'post',
    //         url: '/responsibility/',
    //     });
    //
    //     if (!data || data instanceof Error) {
    //         return console.error('Could not change responsibility:\n' + data);
    //     }
    //
    //     return store.dispatch({type: companyActionTypes.SET_COMPANY_RESPONSIBLE, payload: data});
    // } catch (err) {
    //     return console.error('Error in setResponsibility:\n' + err);
    // }
};

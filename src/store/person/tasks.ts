import {store} from 'store';
import {request, tc} from 'helpers';
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

        if (!data || data instanceof Error) {
            console.error('No data in getPerson', data);
            store.dispatch({ type: personActionTypes.SET_PERSON, payload: {}});
            return store.dispatch({ type: personActionTypes.SET_PERSON_RESPONSIBLE, payload: {}});
        }

        console.log('deals', data[2]);

        // Sort deals on name.
        if (data[2] && data[2].deals) {
            data[2].deals = data[2].deals.sort((a: any, b: any) => {
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

        store.dispatch({ type: personActionTypes.SET_PERSON, payload: data[0]});
        store.dispatch({ type: personActionTypes.SET_PERSON_RESPONSIBLE, payload: data[1]});
        return store.dispatch({ type: personActionTypes.SET_PERSON_DEALS, payload: data[2]});
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

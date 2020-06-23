import {store} from 'store';
import {request, tc} from 'helpers';
import {companyActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';

/**
 * Retrieve company information.
 *
 * @param payload.id
 */
export const getCompany = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getCompany:\n' + payload);
        }

        const company = [await request({
            method: 'get',
            url: '/company/' + payload.id,
        })];

        const responsible = [await request({
            method: 'get',
            url: '/responsibility/' + payload.id,
        })];

        const data = await Promise.all(company.concat(responsible));

        if (!data || data instanceof Error) {
            console.error('No data in getCompany', data);
            store.dispatch({ type: companyActionTypes.SET_COMPANY, payload: {}});
            return store.dispatch({ type: companyActionTypes.SET_COMPANY_RESPONSIBLE, payload: {}});
        }

        // Sort deals on name.
        if (data[0] && data[0].deals) {
            data[0].deals = data[0].deals.sort((a: any, b: any) => {
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

        store.dispatch({ type: companyActionTypes.SET_COMPANY, payload: data[0]});
        return store.dispatch({ type: companyActionTypes.SET_COMPANY_RESPONSIBLE, payload: data[1]});
    } catch(err) {
        return console.error('Error in getCompany:\n' + err);
    }
};

/**
 * Set responsible user for company.
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

        return store.dispatch({type: companyActionTypes.SET_COMPANY_RESPONSIBLE, payload: data});
    } catch (err) {
        return console.error('Error in setResponsibility:\n' + err);
    }
};

/**
 * Add, edit or delete values in a company's phone or email data.
 *
 * (We only change the values that have an id.
 * I.E. we only change/add values from db table 'dealer_custom_data', which is data the users themselves have put in via input fields.
 * And values from db table 'dealer_data_customer, which is values from data integration.
 * We never change values from db table 'company_data', and the data from this table does not include id when sent from backend.)
 *
 * @param payload.action - string - 'add' | 'delete' | 'edit'.
 * @param payload.id - number - Not needed when action is 'add'.
 * @param payload.prospectId - number - Org nr.
 * @param payload.type - string - 'email' | 'phone'.
 * @param payload.value - string - The value.
 */
export const updateCompanyInformation = async (payload) => {
    try {
        // Check that params is correct.
        if (!payload || (payload.type !== 'email' && payload.type !== 'phone') || !payload.action || !payload.prospectId || !payload.hasOwnProperty('value')) {
            return console.error('Missing params in updateCompanyInformation:\n' + payload);
        }
        if ((payload.action === 'delete' || payload.action === 'edit') && !payload.id) {
            return console.error('Missing params in updateCompanyInformation:\n' + payload);
        }

        let existingData = (payload.type === 'email') ? store.getState().company.company.emails : store.getState().company.company.phoneNumbers;
        if (!Array.isArray(existingData)) {
            existingData = [];
        }

        // If value already exists, abort.
        if (existingData && existingData.length && existingData.find((num) => (num.value === payload.value))) {
            return showFlashMessage(tc.valueAlreadyExists);
        }

        const data = await request({
            data: payload,
            method: 'post',
            url: '/information/',
        });

        if (!data ||data instanceof Error) {
            return console.error('Could not update company data', data);
        }

        // Adjust data in store state directly to prevent new backend call.
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

        showFlashMessage(tc.changesSaved);

        if (payload.type === 'email') {
            store.dispatch({type: companyActionTypes.SET_COMPANY_EMAILS, payload: existingData});
        } else if (payload.type === 'phone') {
            store.dispatch({type: companyActionTypes.SET_COMPANY_PHONENUMBERS, payload: existingData});
        }
    } catch (err) {
        return console.error('Error in updateCompanyInformation:\n' + err);
    }
};


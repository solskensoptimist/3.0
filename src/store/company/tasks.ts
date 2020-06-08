import {store} from 'store';
import {request, tc} from 'helpers';
import {companyActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';

/**
 * Add, edit or delete values in a company's phone or email data.
 *
 * (We only change the values that have an id.
 * I.E. we only change/add values from db table 'dealer_custom_data', which is data the users themselves have put in via input fields.
 * And values from db table 'dealer_data_customer, which is values from data integration.
 * We never change values from db table 'company_data', and the data from this table does not include id when sent from backend.)
 *
 * @param payload.action - string - 'add' | 'delete' | 'edit'
 * @param payload.id - number - Not needed when action is 'add'
 * @param payload.prospectId - number
 * @param payload.type - string - 'email' | 'phone'
 */
export const addEditRemoveCompanyEmailPhone = async (payload) => {
    // Check that params is correct.
    if ((payload.type !== 'email' && payload.type !== 'phone') || !payload.action || !payload.prospectId || !payload.hasOwnProperty('value')) {
        return console.error('Missing params in addEditRemovePhoneEmail');
    }
    if ((payload.action === 'delete' || payload.action === 'edit') && !payload.id) {
        return console.error('Missing params in addEditRemovePhoneEmail');
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
};

/**
 * Retrieve company information.
 *
 * @param payload.id
 */
export const getCompany = async (payload) => {
    try {
        if (!payload || (payload && !payload.id)) {
            return console.error('Missing params in getCompany');
        }

        const company = await request({
            method: 'get',
            url: '/company/' + payload.id,
        });

        if (!company || company instanceof Error) {
            console.error('No data in getCompany', company);
            return store.dispatch({ type: companyActionTypes.SET_COMPANY, payload: {}});
        }

        await store.dispatch({ type: companyActionTypes.SET_COMPANY, payload: company});
        return;
    } catch(err) {
        return console.error('Error in getCompany:', err);
    }
};

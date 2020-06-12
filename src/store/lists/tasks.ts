import {store} from 'store';
import {request} from 'helpers';
import {listsActionTypes} from './actions';

/**
 * Get lists for user.
 *
 * @param payload.archived - bool - If set to true, get archived lists.
 */
export const getLists = async (payload) => {
    try {
        const data = await request({
            data: {
                // page: this.page,
                // sort: sort,
                // filter: this.filter,
                archived: (payload && payload.archived) ? payload.archived : false,
            },
            method: 'get',
            url: '/lists/',
        });

        if (!data || (data && !data.data)) {
            return;
        }

        if (data instanceof Error) {
            return console.error('Error in getLists:\n' + data);
        }

        const result = {
            lists: data.data,
        };

        return store.dispatch({type: listsActionTypes.SET_LISTS, payload: result});
    } catch (err) {
        return console.error('Error in getLists:\n' + err);
    }
};

/**
 * Save prospect to a new or existing list.
 *
 * @param payload.list - object
 * @param payload.prospects - array
 */
export const saveProspectsToList = async (payload) => {
    try {
        if (!payload || (payload && !payload.list) || (payload && !payload.prospects) || (payload && payload.prospects && !payload.prospects.length)) {
            return console.error('Missing params in saveProspectsToList:\n' + payload);
        }

        console.log('saveProspectsToList', payload);

    } catch (err) {
        return console.error('Error in saveProspectsToList:\n' + err);
    }
};

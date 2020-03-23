import {store} from 'store';
import {request} from 'helpers';
import {listsActionTypes} from './actions';

/**
 * Get lists for user.
 * If archived set to true, get archived lists.
 */
export const getLists = async (payload) => {
    request({
        data: {
            // page: this.page,
            // sort: sort,
            // filter: this.filter,
            archived: (payload && payload.archived) ? payload.archived : false,
        },
        method: 'get',
        url: '/lists/',
    })
    .then((data) => {
        console.log('data', data);
        const result = {
            lists: data.data,
        };

        return store.dispatch({type: listsActionTypes.SET_LISTS, payload: result});
    })
    .catch((err) => {
        return console.error('Error in getLists:', err);
    });
};

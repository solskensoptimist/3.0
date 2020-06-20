import {store} from 'store';
import {request} from 'helpers';
import {listsActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {tc} from 'helpers';

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
 * @param payload.name - string - Name of new list.
 * @param payload.lists - array - Ids of existing lists.
 * @param payload.prospectIds - array - Prospects ids.
 */
export const saveProspectsToList = async (payload) => {
    try {
        if (!payload || (payload && !payload.name && !payload.lists) || (payload && (!payload.prospectIds || !payload.prospectIds.length))) {
            console.error('Missing params in saveProspectsToList:\n' + payload);
            return showFlashMessage(tc.couldNotSaveToList);
        }

        let data;

        console.log(payload);

        if (payload.name && payload.name.length) {
            data = await request({
                data: {
                    name: payload.name,
                    prospect_ids: payload.propspectIds,
                },
                method: 'post',
                url: '/lists/',
            });
        } else {
            data = await request({
                data: {
                    lists: payload.lists,
                    prospect_ids: payload.prospectIds,
                },
                method: 'post',
                url: '/lists/append/',
            });
        }

        if (! data || data instanceof Error) {
            return console.error('Could not save prospects to list:\n' + data);
        }

        return showFlashMessage(tc.savedInList)
    } catch (err) {
        return console.error('Error in saveProspectsToList:\n' + err);
    }
};

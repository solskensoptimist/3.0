import {store} from 'store';
import {request, requestWithBody} from 'helpers';
import {listsActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {tc} from 'helpers';

/**
 * Archive a list of list ids.
 *
 * @param payload.listIds - array
 */
export const archiveLists = async (payload) => {
    try {
        if (!payload || (payload && !payload.listIds) || (payload && payload.listIds && !payload.listIds.length)) {
            return console.error('Missing params in archiveLists\n' + payload);
        }

        const data = await request({
                data: {
                    listIds: payload.listIds,
                },
            method: 'post',
            url: '/lists/archive/',
        });

        if (data instanceof Error) {
            return console.error('Error in archiveLists:\n' + data);
        }

        showFlashMessage(tc.listsHaveBeenArchived);

        // Filter lists from state directly to prevent new backend call.
        const newLists = store.getState().lists.lists.filter((num) => !payload.listIds.includes(num._id));
        return store.dispatch({type: listsActionTypes.SET_LISTS, payload: newLists});
    } catch (err) {
        return console.error('Error in archiveLists:\n' + err);
    }
};

/**
 * Get lists.
 *
 * @param payload.archived - bool - If set to true, get archived lists.
 * @param payload.filter - Not used as of now, will be used in /aktivitet when filter component is built.
 */
export const getLists = async (payload) => {
    try {
        const data = await request({
            data: {
                filter: (payload && payload.filter) ? payload.filter : null,
                archived: (payload && payload.archived) ? payload.archived : false,
            },
            method: 'get',
            url: '/lists/',
        });

        if (!data || (data && !data.data) || (data && data.data && !data.data.length)) {
            if (payload.archived) {
                return store.dispatch({type: listsActionTypes.SET_LISTS_ARCHIVED, payload: []});
            } else {
                return store.dispatch({type: listsActionTypes.SET_LISTS, payload: []});
            }
        }

        if (data instanceof Error) {
            return console.error('Error in getLists:\n' + data);
        }

        let lists = data.data;
        if (payload.archived) {
            store.dispatch({type: listsActionTypes.SET_LISTS_ARCHIVED, payload: lists});
        } else {
            store.dispatch({type: listsActionTypes.SET_LISTS, payload: lists});
        }

        // Retrieve order information for each list, do this in the background since it's heavy lifting.
        const orderInformation = await request({
            data: {
                listIds: lists.map((num) => num._id),
            },
            method: 'get',
            url: '/lists/getOrderHistory/',
        });

        lists.map((list) => {
            const orderDataObj = orderInformation.filter((num) => num._id === list._id);
            return {
                ...list,
                availableOrderData: orderDataObj[0].availableOrderData,
                orderHistory: orderDataObj[0].orderHistory,
            }
            // list.availableOrderData = orderDataObj[0].availableOrderData;
            // list.orderHistory = orderDataObj[0].orderHistory;
            // return list;
        });

        if (payload.archived) {
            return store.dispatch({type: listsActionTypes.SET_LISTS_ARCHIVED, payload: lists});
        } else {
            return store.dispatch({type: listsActionTypes.SET_LISTS, payload: lists});
        }
    } catch (err) {
        return console.error('Error in getLists:\n' + err);
    }
};

/**
 * Merges lists.
 *
 * @param payload.listIds - array
 * @param payload.name - string
 */
export const mergeLists = async (payload) => {
    try {
        if (!payload || (payload && !payload.name) || (payload && !payload.listIds) || (payload && payload.listIds && !payload.listIds.length) || (payload && payload.listIds && payload.listIds.length < 2)) {
            return console.error('Missing params in mergeLists\n' + payload);
        }

        const data = await request({
            data: {
                lists: payload.listIds,
                name: payload.name,
            },
            method: 'post',
            url: '/lists/merge/',
        });

        if (data instanceof Error) {
            return console.error('Error in mergeLists:\n' + data);
        }

        showFlashMessage(tc.listHaveBeenCreated);
        return await getLists({});
    } catch (err) {
        return console.error('Error in removeLists:\n' + err);
    }
};


/**
 * Removes lists.
 *
 * @param payload.archived - bool - To know if the lists we remove is from archived lists or regular lists.
 * @param payload.listIds - array
 */
export const removeLists = async (payload) => {
    try {
        if (!payload || (payload && !payload.listIds) || (payload && payload.listIds && !payload.listIds.length)) {
            return console.error('Missing params in removeLists\n' + payload);
        }

        const promises = await payload.listIds.map(async (id) => {
            return await requestWithBody({
                data: {
                    list_id: id
                },
                method: 'delete',
                url: '/lists/',
            });
        });

        const data = await Promise.all(promises);

        const invalidResults = data.filter((result) => (result instanceof Error));

        if (invalidResults.length) {
            showFlashMessage(tc.thereWasAProblem);
            return console.error('Error in removeLists:\n' + data);
        }

        showFlashMessage(tc.listsHaveBeenRemoved);

        if (payload.archived) {
            const newLists = store.getState().lists.listsArchived.filter((num) => !payload.listIds.includes(num._id));
            return store.dispatch({type: listsActionTypes.SET_LISTS_ARCHIVED, payload: newLists});
        } else {
            const newLists = store.getState().lists.lists.filter((num) => !payload.listIds.includes(num._id));
            return store.dispatch({type: listsActionTypes.SET_LISTS, payload: newLists});
        }
    } catch (err) {
        return console.error('Error in removeLists:\n' + err);
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

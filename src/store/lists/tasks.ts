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
 * Create list subscription.
 *
 * @param payload.subscribeFlag - number
 * @param payload.listIds - string
 */
export const createListSubscription = async (payload) => {
    try {
        if (!payload || (payload && !payload.listIds) || (payload && payload.listIds && !payload.listIds.length) || (payload && !payload.subscribeFlag)) {
            return console.error('Missing params in createListSubscription\n' + payload);
        }

        const data = await requestWithBody({
            data: {
                listIds: payload.listIds,
                subscribeFlag: payload.subscribeFlag,
            },
            method: 'post',
            url: '/lists/subscriptions/subscribe/',
        });

        if (data instanceof Error) {
            return console.error('Error in createListSubscription:\n' + data);
        }

        showFlashMessage(tc.listsSubscriptionsHaveBeenCreated);
        return await getListsSubscriptions();
    } catch (err) {
        return console.error('Error in createListSubscription:\n' + err);
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
        // (Note that lists have static properties 'orderCompany', 'orderMailings' etc, but we do not rely on these for order information.
        // These properties have historically been set every time a user places an order, but that doesn't show if order is canceled or delivered.
        // Here we do an actual check in databases for order information instead.)
        const orderInformation = await request({
            data: {
                listIds: lists.map((num) => num._id),
            },
            method: 'post',
            url: '/lists/getOrderHistory/',
        });

        lists.map((list) => {
            const orderDataObj = orderInformation.filter((num) => num._id === list._id);
            list.availableOrderData = orderDataObj[0].availableOrderData;
            list.orderHistory = orderDataObj[0].orderHistory;
            return list;
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
 * Get lists subscriptions.
 */
export const getListsSubscriptions = async () => {
    try {
        const data = await request({
            method: 'get',
            url: '/lists/subscriptions/',
        });

        if (data instanceof Error) {
            return console.error('Error in getListsSubscriptions:\n' + data);
        }

        return store.dispatch({type: listsActionTypes.SET_LISTS_SUBSCRIPTIONS, payload: data});

    } catch (err) {
        return console.error('Error in getListsSubscriptions:\n' + err);
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
            showFlashMessage(tc.thereWasAProblemContactCustomerService);
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
 * Remove lists subscriptions.
 *
 * @param payload.ids - array - Lists subscriptions ids.
 */
export const removeListsSubscriptions = async (payload) => {
    try {
        if (!payload || (payload && !payload.ids) || (payload && payload.ids && !payload.ids.length)) {
            return console.error('Missing params in removeListsSubscriptions:\n' + payload);
        }

        const data = await requestWithBody({
            data: {
                ids: payload.ids,
            },
            method: 'delete',
            url: '/lists/subscriptions/',
        });

        if (data instanceof Error) {
            return console.error('Error in removeListsSubscriptions:\n' + data);
        }

        showFlashMessage(tc.listsSubscriptionsHaveBeenRemoved);
        return await getListsSubscriptions();
    } catch (err) {
        return console.error('Error in removeListsSubscriptions:\n' + err);
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
        if (!payload || (payload && !payload.name && !payload.lists) || (payload && (!payload.prospectIds || (payload.prospectIds && !payload.prospectIds.length)))) {
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

/**
 * Share lists.
 *
 * @param payload.listIds - array
 * @param payload.userIds - array
 */
export const shareLists = async (payload) => {
    try {
        if (!payload || (payload && !payload.listIds) || (payload && payload.listIds && !payload.listIds.length) || (payload && !payload.userIds) || (payload && payload.userIds && !payload.userIds.length)) {
            return console.error('Missing params in shareLists:\n' + payload);
        }

        const data = await request({
            data: {
                lists: payload.listIds,
                users: payload.userIds,
            },
            method: 'post',
            url: '/lists/share/',
        });

        if (data instanceof Error) {
            return console.error('Error in shareLists:\n' + data);
        }

        showFlashMessage(tc.listsHaveBeenShared);
        return await getLists({});
    } catch (err) {
        return console.error('Error in shareListst:\n' + err);
    }
};


/**
 * Save list splits to new lists.
 *
 * @param payload.listId - string
 * @param payload.splits - array - [{size: 4, name: "Ny lista släpvagnar 1"}, {size: 4, name: "Ny lista släpvagnar 2"}]
 */
export const splitList = async (payload) => {
    try {
        if (!payload || (payload && !payload.listId) || (payload && (!payload.splits || (payload.splits && !payload.splits.length)))) {
            console.error('Missing params in splitList:\n' + payload);
            return showFlashMessage(tc.thereWasAProblemContactCustomerService);
        }

        const splits = payload.splits.map((split) => {
            return {
                name: split.name,
                size: split.size,
                type: 'value',
            }
        });

        const data = await request({
            data: {
                listId: payload.listId,
                splits: splits,
            },
            method: 'post',
            url: '/lists/split/',
        });

        if (data instanceof Error) {
            return console.error('Error in splitList:\n' + data);
        }

        showFlashMessage(tc.listsHaveBeenCreated);
        return await getLists({});
    } catch (err) {
        return console.error('Error in splitList:\n' + err);
    }
};

/**
 * Move lists from archived to regular lists.
 *
 * @param payload.listIds - array
 */
export const undoArchive = async (payload) => {
    try {
        if (!payload || (payload && !payload.listIds) || (payload && payload.listIds && !payload.listIds.length)) {
            return console.error('Missing params in undoArchives:\n' + payload);
        }

        const data = await request({
            data: {
                listIds: payload.listIds,
            },
            method: 'post',
            url: '/lists/undoArchive/',
        });

        if (data instanceof Error) {
            return console.error('Error in undoArchive:\n' + data);
        }

        showFlashMessage(tc.listsHaveBeenMoved);
        return await getLists({archived: true});
    } catch (err) {
        return console.error('Error in undoArchive:\n' + err);
    }
};

/**
 * Update name on list.
 *
 * @param payload.listId
 * @param payload.name
 */
export const updateListName = async (payload) => {
    try {
        if (!payload || (payload && !payload.listId) || (payload && !payload.name)) {
            return console.error('Missing params in updateListName\n' + payload);
        }

        const data = await request({
            data: {
                listId: payload.listId,
                name: payload.name,
            },
            method: 'post',
            url: '/lists/changeName/',
        });

        if (data instanceof Error) {
            return console.error('Error in updateListName:\n' + data);
        }

        // Update name in store directly to avoid new backend call.
        let lists = store.getState().lists.lists;
        lists.map((num) => {
            if (num._id === payload.listId) {
                num.name = payload.name;
            }
            return num;
        });

        return store.dispatch({type: listsActionTypes.SET_LISTS, payload: lists});
    } catch (err) {
        return console.error('Error in updateListName:\n' + err);
    }
};

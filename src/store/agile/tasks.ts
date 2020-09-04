import {store} from 'store';
import {agileHelper, request, tc} from 'helpers';
import {agileActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addEntityToContacts} from 'store/contacts/tasks';

/**
 * Add activity to a deal. Either historic/performed or planned.
 *
 * @param payload.action - string
 * @param payload.comment - string
 * @param payload.dealId - string
 * @param payload.event_date - date
 * @param payload.performed - bool
 */
export const addActivity = async (payload) => {
    try {
        if (!payload || (payload && !payload.dealId) || (payload && !payload.action) || (payload && !payload.event_date)) {
            return console.error('Missing params in addActivity', payload);
        }

        let data = await request({
            data: {
                action: payload.action,
                comment: payload.comment,
                dealId: payload.dealId,
                event_date: payload.event_date,
            },
            method: 'post',
            url: (payload.performed) ? '/deals/actions/' : 'deals/events',
        });

        if (data instanceof Error) {
            console.error('Could not add activity in addActivity:\n' + data);
        }

        let newColumns = JSON.parse(JSON.stringify(store.getState().agile.columns));

        newColumns.map((column) => {
            if (column.id !== 'prospects' && column.items.find((num) => num._id === payload.dealId)) {
                column.items.map((num) => {
                    if (num._id === payload.dealId) {
                        num.events.push(data);
                    }
                    return num;
                });
            }
            return column;
        });

        showFlashMessage(tc.activityHasBeenSaved);
        // Ska vi köra getAgileColumnsData istället:..?!?!? Detta verkar inte uppdatera komponenterna...
        return store.dispatch({ type: agileActionTypes.SET_COLUMNS, payload: newColumns});
    } catch(err) {
        return console.error('Error in addActivity:\n' + err);
    }
};

/**
 * Create a deal.
 *
 * @param payload.cars
 * @param payload.contacts
 * @param payload.description
 * @param payload.files
 * @param payload.maturity
 * @param payload.prospects
 * @param payload.user_id
 */
export const createDeal = async (payload) => {
    try {
        const data = await request({
            data: {
                cars: payload.cars ? payload.cars : [],
                comments: '', // Deprecated property
                contacts: [], // Deprecated property
                description: payload.description ? payload.description : '',
                files: payload.files ? payload.files : [],
                maturity: payload.maturity ? payload.maturity : null,
                name: payload.name ? payload.name : null,
                phase: 'idle',
                prospects: payload.prospects ? payload.prospects : [],
                responsible: payload.responsible ? payload.responsible : null,
            },
            method: 'post',
            url: '/deals/',
        });

        if (!data || data instanceof Error) {
            showFlashMessage(tc.couldNotCreateDeal);
            console.error('Could not create deal:\n' + data);
        }

        // If contacts was provided, add deal id to these contacts.
        if (payload.contacts && payload.contacts.length && data._id) {
            await addEntityToContacts({
                contacts: payload.contacts,
                entityId: data._id,
                entityType: 'deal',
            })
        }

        return showFlashMessage(tc.dealWasCreated);
    } catch(err) {
        return console.error('Error in createDeal:\n' + err);
    }
};

/**
 * Get columns for agile.
 * If no column structure in store state, get column structure from backend first, and then map deals and prospects accordingly.
 *
 * This is the main function we use to receive data, we also set columns data to store state here.
 * Basically we collect deals from backend, then we retrieve saved agile column structure, and then we retrieve saved sorting value.
 * After that we map columns where deal phase match column id. Lastly we sort the columns.
 */
export const getColumnsData = async () => {
    try {
        // Get column structure.
        let columns;
        if (!store.getState().agile.columns ||
            (store.getState().agile.columns && !store.getState().agile.columns.length)) {
            // No columns in store state, retrieve from backend.
            columns = await getColumnStructure();
        } else {
            columns = JSON.parse(JSON.stringify(store.getState().agile.columns));
        }

        const phases = columns.map((column) => {
            return column.id;
        });

        // Get deals and prospects.
        const data = await request({
            data: {
                phases: phases,
            },
            method: 'get',
            url: '/agile/getAgile/',
        });

        if (data instanceof Error) {
            console.error('Error in getColumnsData:\n' + data);
        }

        // Add/empty items array to each column.
        columns.map((column) => {
            column.items = [];
            return column;
        });

        // Place prospects in prospects column. Holds prospects that hasn't been turned into deals yet.
        if (data.prospects && data.prospects.data && data.prospects.data.length) {
            const prospectColumn = columns.find((num) => num.id === 'prospects');
            prospectColumn.items = data.prospects.data;
        }

        // Place deals in correct column.
        if (data.deals && data.deals.length) {
            data.deals.forEach((deal) => {
                const column = columns.find((num) => num.id === deal.phase);
                if (column) {
                    column.items.push(deal);
                } else if (columns.find((num) => num.id === 'phaseMissingColumn')) {
                    // If deal phase doesn't have a corresponding column, we put it into a misc column (should never happen)...
                    const phaseMissingColumn = columns.find((num) => num.id === 'phaseMissingColumn');
                    phaseMissingColumn.items.push(deal);
                } else {
                    // ...if misc column doesn't exist, create it.
                    columns.push({
                        id: 'phaseMissingColumn',
                        title: tc.missingColumn,
                        items: [deal],
                    });
                }
            });

            const sortValue = await getSortValue();

            // Sort columns.
            columns = await sortColumns({sort: sortValue, columns: columns, skipUpdateState: true});
        }

        return store.dispatch({ type: agileActionTypes.SET_COLUMNS, payload: columns});
    } catch(err) {
        return console.error('Error in getColumnsData:\n' + err);
    }
};

/**
 * Get saved agile column structure and sort value.
 */
const getColumnStructure = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getColumnStructure/',
        });

        // No columns found in db, probably first time user log into bilprospekt-3.0...
        if (data instanceof Error || !data) {
            console.error('Could not get columns in getColumnStructure:\n' + data);

            // ...set default column structure that correspond to deal phases in bilprospekt-2.0...
            data = [
                {
                    id: 'prospects',
                    title: tc.prospects,
                    items: [],
                },
                {
                    id: 'idle',
                    title: tc.notStartedDeals,
                    items: [],
                },
                {
                    id: 'todo',
                    title: tc.inContact,
                    items: [],
                },
                {
                    id: 'contacted',
                    title: tc.contacted,
                    items: [],
                },
                {
                    id: 'negotiation',
                    title: tc.negotiation,
                    items: [],
                }
            ];

            // ...and save to db.
            await updateColumnStructure(data)
        }

        return data;
    } catch(err) {
        return console.error('Error in getColumnStructure:\n' + err);
    }
};

/**
 * Get agile filters.
 */
export const getFilters = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getFilters/',
        });

        if (data instanceof Error || !data) {
            console.error('Error in getFilters:\n' + data);
            data = agileHelper.getDefaultFilters();
            data.map((num) => {
                num.active = false;
                return num;
            });
        }

        data = data.filter((num) => num.id !== 'include_colleagues'); // We deprecate this filter in 3.0.

        return store.dispatch({ type: agileActionTypes.SET_FILTERS, payload: data});
    } catch(err) {
        return console.error('Error in getFilter:\n' + err);
    }
};

const getSortValue = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getSortValue/',
        });

        if (data instanceof Error || !data) {
            console.error('Could not get sort value in getSortValue:\n' + data);
        }

        return data;
    } catch(err) {
        return console.error('Error in getSortValue:\n' + err);
    }
};

/**
 * Move a deal to a new column/phase.
 *
 * @param payload.action - string (optional) - If we want to add a deal action simultaneously.
 * @param payload.comment - string (optional) - Comment belonging to action.
 * @param payload.id - string
 * @param payload.isDeal - bool
 * @param payload.prospectIds - string- String of prospectIds separated by comma.
 * @param payload.source - string - Previous column/phase
 * @param payload.target - string - New column/phase
 */
export const moveDeal = async (payload) => {
    try {
        // if (!payload || (payload && !payload.dealId) || (payload && !payload.action) || (payload && !payload.event_date)) {
        //     return console.error('Missing params in moveDeal', payload);
        // }
        //
        // let data = await request({
        //     data: {
        //         action: payload.action,
        //         comment: payload.comment,
        //         dealId: payload.dealId,
        //         event_date: payload.event_date,
        //     },
        //     method: 'post',
        //     url: (payload.performed) ? '/deals/actions/' : 'deals/events',
        // });
        //
        // if (data instanceof Error) {
        //     console.error('Could not add activity in moveDeal:\n' + data);
        // }
        //
        // let newColumns = store.getState().agile.columns.map((column) => {
        //     if (column.id !== 'prospects' && column.items.find((num) => num._id === payload.dealId)) {
        //         column.items.map((num) => {
        //             if (num._id === payload.dealId) {
        //                 num.events.push(data);
        //             }
        //             return num;
        //         });
        //     }
        //     return column;
        // });
        //
        // showFlashMessage(tc.activityHasBeenSaved);
        // // Ska vi köra getAgileColumnsData istället:..?!?!? Detta verkar inte uppdatera komponenterna...
        // return store.dispatch({ type: agileActionTypes.SET_COLUMNS, payload: newColumns});
    } catch(err) {
        return console.error('Error in moveDeal:\n' + err);
    }
};

/**
 * Sort columns.
 *
 * Used in UI sorting menu, if so just provide payload.sort and it saves to store state and db.
 * Can also be used as a sorting helper without saving to db or store state.
 *
 * @param payload.columns - array (optional) - We can provide columns, otherwise retrieve it from store state.
 * @param payload.sort - string - Should match a value in agileHelper.getColumnSortValues.
 * @param payload.skipUpdateState - boolean (optional) - If we want to skip backend call with new sort value and return columns without saving to state.
 */
export const sortColumns = async (payload) => {
    let columns = payload.columns ? payload.columns : JSON.parse(JSON.stringify(store.getState().agile.columns));
    let sort = payload.sort;

    columns.map((column) => {
        if (column.id === 'prospects') {
            return column;
        }

        switch (sort) {
            case 'createdAsc':
                column.items = column.items.sort((a, b) => {
                    if (new Date(a.created) < new Date(b.created)){
                        return -1;
                    } else if (new Date(a.created) > new Date(b.created)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            case 'createdDesc':
                column.items = column.items.sort((a, b) => {
                    if (new Date(a.created) > new Date(b.created)){
                        return -1;
                    } else if (new Date(a.created) < new Date(b.created)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            case 'updatedAsc':
                column.items = column.items.sort((a, b) => {
                    if (new Date(a.updated) < new Date(b.updated)){
                        return -1;
                    } else if (new Date(a.updated) > new Date(b.updated)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            case 'updatedDesc':
                column.items = column.items.sort((a, b) => {
                    if (new Date(a.updated) > new Date(b.updated)){
                        return -1;
                    } else if (new Date(a.updated) < new Date(b.updated)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            default:
                sort = 'updatedDesc';
                column.items = column.items.sort((a, b) => {
                    if (new Date(a.updated) > new Date(b.updated)){
                        return -1;
                    } else if (new Date(a.updated) < new Date(b.updated)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
        }

        return column;
    });

    if (payload.skipUpdateState) {
        store.dispatch({type: agileActionTypes.SET_SORT, payload: sort});
        return columns;
    } else {
        // Save to state and db.
        store.dispatch({type: agileActionTypes.SET_SORT, payload: sort});
        store.dispatch({type: agileActionTypes.SET_COLUMNS, payload: columns});
        return await updateSortValue(payload.sort);
    }
};

/**
 * Update agile column structure in db.
 * We remove static prospects column before saving to backend.
 *
 * @param columns - Array
 */
export const updateColumnStructure = async (columns) => {
    try {
        if (!columns || (columns && !columns.length)) {
            return console.error('Missing params in updateColumnStructure');
        }

        // Update state.
        store.dispatch({ type: agileActionTypes.SET_COLUMNS, payload: columns});

        // Clone.
        let columnStructure = JSON.parse(JSON.stringify(columns));

        // Remove items array from columns.
        columnStructure = columnStructure.map((num) => {
            delete num.items;
            return num;
        });

        // Extra check, user should never be able to remove this column.
        if (!columnStructure.find((num) => num.id === 'prospects')) {
            columnStructure.unshift({
                id: 'prospects',
                title: tc.prospects,
            });
        }

        // If the misc column exists but has no items, remove it. (This column should never exist but an extra check.)
        columnStructure = columnStructure.filter((column) => {
            return !(column.id === 'phaseMissingColumn' && (!column.items || (column.items && !column.items.length)));
        });

        const data = await request({
            data: {
                columns: columnStructure,
            },
            method: 'put',
            url: '/agile/updateColumnStructure/',
        });

        if (data instanceof Error) {
            console.error('Error in updateColumnStructure:\n' + data);
        }
    } catch(err) {
        return console.error('Error in updateColumnStructure:\n' + err);
    }
};

/**
 * Update title for a column.
 *
 * @param payload.id - string
 * @param payload.title - string
 */
export const updateColumnTitle = async (payload) => {
    try {
        if (!payload || (payload && !payload.id) || (payload && !payload.title)) {
            return console.error('Missing params in updateColumnTitle');
        }

        let newColumns = JSON.parse(JSON.stringify(store.getState().agile.columns));

        newColumns.map((column) => {
            if (column.id === payload.id) {
                column.title = payload.title;
            }
            return column;
        });

        return await updateColumnStructure(newColumns);
    } catch(err) {
        return console.error('Error in updateColumnStructure:\n' + err);
    }
};

/**
 * Update agile filters.
 *
 * @param payload - object - {id: , name: , type: }
 */
export const updateFilters = async (payload) => {
    try {
        if (!payload || (payload && !payload.id) || (payload && !payload.name) || (payload && !payload.type)) {
            return console.error('Missing params in updateFilters');
        }

        let filters = JSON.parse(JSON.stringify(store.getState().agile.filters));

        if (filters.find((num) => num.id === payload.id)) {
            filters = filters.filter((num) => num.id !== payload.id);
        } else {
            filters.push({
                active: true,
                id: payload.id,
                name: payload.name,
                meta: {
                    type: payload.type,
                }
            });
        }

        filters = filters.filter((num) => num.active);

        const data = await request({
        data: {
            filter: filters,
        },
           method: 'put',
           url: '/agile/settings',
        });

        if (data instanceof Error) {
           return console.error('Error in updateFilters:\n' + data);
        }

        store.dispatch({type: agileActionTypes.SET_FILTERS, payload: filters});
        return await getColumnsData();
   } catch(err) {
        return console.error('Error in updateFilter:\n' + err);
   }
};

/**
* Update agile sort value to db.
*
* @param sort - string
*/
const updateSortValue = async (sort) => {
    try {
        if (!sort) {
            return console.error('Missing params in updateSortValue');
        }

        const data = await request({
            data: {
                sort: sort,
            },
            method: 'put',
            url: '/agile/updateSortValue/',
        });

        if (data instanceof Error) {
            console.error('Error in updateSortValue:\n' + data);
        }
    } catch(err) {
        return console.error('Error in updateSortValue:\n' + err);
    }
};



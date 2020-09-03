import {store} from 'store';
import {agileHelper, request, tc} from 'helpers';
import {agileActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addEntityToContacts} from 'store/contacts/tasks';

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
export const getAgileColumnsData = async () => {
    try {
        // Get column structure.
        let columns;
        if (!store.getState().agile.columns ||
            (store.getState().agile.columns && !store.getState().agile.columns.length)) {
            // No columns in store state, retrieve from backend.
            columns = await getAgileColumnStructure();
        } else {
            columns = store.getState().agile.columns;
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
            console.error('Error in getAgileColumnsData:\n' + data);
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

            const sortValue = await getAgileSortValue();

            // Sort columns.
            columns = await sortColumns({sort: sortValue, columns: columns, skipUpdateState: true});
        }

        return store.dispatch({ type: agileActionTypes.SET_AGILE_COLUMNS, payload: columns});
    } catch(err) {
        return console.error('Error in getAgileColumnsData:\n' + err);
    }
};

/**
 * Get saved agile column structure and sort value.
 */
const getAgileColumnStructure = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getColumnStructure/',
        });

        // No columns found in db, probably first time user log into bilprospekt-3.0...
        if (data instanceof Error || !data) {
            console.error('Could not get columns in getAgileColumnStructure:\n' + data);

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
            await updateAgileColumnStructure(data)
        }

        return data;
    } catch(err) {
        return console.error('Error in getAgileColumnStructure:\n' + err);
    }
};

/**
 * Get agile filters.
 */
export const getAgileFilters = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getFilters/',
        });

        if (data instanceof Error || !data) {
            console.error('Error in getAgileFilters:\n' + data);
            data = agileHelper.getDefaultFilters();
            data.map((num) => {
                num.active = false;
                return num;
            });
        }

        data = data.filter((num) => num.id !== 'include_colleagues'); // We deprecate this filter in 3.0.

        return store.dispatch({ type: agileActionTypes.SET_AGILE_FILTERS, payload: data});
    } catch(err) {
        return console.error('Error in getAgileFilter:\n' + err);
    }
};

const getAgileSortValue = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getSortValue/',
        });

        if (data instanceof Error || !data) {
            console.error('Could not get sort value in getAgileSortValue:\n' + data);
        }

        return data;
    } catch(err) {
        return console.error('Error in getAgileSortValue:\n' + err);
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
    let columns = payload.columns ? payload.columns : store.getState().agile.columns;
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
        store.dispatch({type: agileActionTypes.SET_AGILE_SORT, payload: sort});
        return columns;
    } else {
        // Save to state and db.
        store.dispatch({type: agileActionTypes.SET_AGILE_SORT, payload: sort});
        store.dispatch({type: agileActionTypes.SET_AGILE_COLUMNS, payload: columns});
        return await updateAgileSortValue(payload.sort);
    }
};

/**
 * Update agile column structure in db.
 * We remove static prospects column before saving to backend.
 *
 * @param columns - Array
 */
export const updateAgileColumnStructure = async (columns) => {
    try {
        if (!columns || (columns && !columns.length)) {
            return console.error('Missing params in updateAgileColumnStructure');
        }

        // Update state.
        store.dispatch({ type: agileActionTypes.SET_AGILE_COLUMNS, payload: columns});

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
            console.error('Error in updateAgileColumnStructure:\n' + data);
        }
    } catch(err) {
        return console.error('Error in updateAgileColumnStructure:\n' + err);
    }
};

/**
 * Update title for a column.
 *
 * @param payload.id - string
 * @param payload.title - string
 */
export const updateAgileColumnTitle = async (payload) => {
    try {
        if (!payload || (payload && !payload.id) || (payload && !payload.title)) {
            return console.error('Missing params in updateAgileColumnTitle');
        }

        let newColumns = store.getState().agile.columns;

        newColumns.map((column) => {
            if (column.id === payload.id) {
                column.title = payload.title;
            }
            return column;
        });

        return await updateAgileColumnStructure(newColumns);
    } catch(err) {
        return console.error('Error in updateAgileColumnStructure:\n' + err);
    }
};

export const updateAgileDealPhase= async (payload) => {
    try {

        console.log('payliad i updateAgileDealPhase', payload);

        // Gör check någonstans på om vi skickar med utförd/planerad aktivitet.

        // http://localhost:3000/agile/moveDeal
        // PUT
        // FÖR DEAL:
        // id: 5eee294f49ee267820869c35
        // isDeal: true
        // source: todo
        // target: contacted
        // action: offer
        // comment:
        //     prospectIds: 9281859
        //
        //
        //
        // FRÅN KOLUMNEN PROSPECTS:
        // id: 5f4f7b695ceeca59a857adf2
        // isDeal: true
        // source: idle
        // target: todo
        // action: meeting
        // comment:
        //     prospectIds:
        //         listId: 5f3be7b306e7b01a0d45159a
        //
        // DETTA SKER FÖRST..?
        //     /deals
        //     POST
        //     name:
        //     phase: idle
        // prospects[]: 4280907
        // listId: 5f3be7b306e7b01a0d45159a
        // moved: true

        // const data = await request({
        //     method: 'getasdasd',
        //     url: '/agile/getFilters/asdasdasdasd',<--- måste finnas endpoint för detta!
        // });

        // if (data instanceof Error) {
        //     return console.error('Error in updateAgileFilters:\n' + data);
        // }

        // return store.dispatch({type: agileActionTypes.SET_AGILE_FILTERS, payload: data});
    } catch(err) {
        return console.error('Error in updateAgileFilter:\n' + err);
    }
};

/**
 * Update agile filters.
 *
 * @param payload - object - {id: , name: , type: }
 */
export const updateAgileFilters = async (payload) => {
    try {
        if (!payload || (payload && !payload.id) || (payload && !payload.name) || (payload && !payload.type)) {
            return console.error('Missing params in updateAgileFilters');
        }

        let filters = store.getState().agile.filters;

        if (store.getState().agile.filters.find((num) => num.id === payload.id)) {
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
           return console.error('Error in updateAgileFilters:\n' + data);
        }

        store.dispatch({type: agileActionTypes.SET_AGILE_FILTERS, payload: filters});
        return await getAgileColumnsData();
   } catch(err) {
        return console.error('Error in updateAgileFilter:\n' + err);
   }
};

/**
* Update agile sort value to db.
*
* @param sort - string
*/
const updateAgileSortValue = async (sort) => {
    try {
        if (!sort) {
            return console.error('Missing params in updateAgileSortValue');
        }

        const data = await request({
            data: {
                sort: sort,
            },
            method: 'put',
            url: '/agile/updateSortValue/',
        });

        if (data instanceof Error) {
            console.error('Error in updateAgileSortValue:\n' + data);
        }
    } catch(err) {
        return console.error('Error in updateAgileSortValue:\n' + err);
    }
};



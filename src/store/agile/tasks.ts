import {store} from 'store';
import {agileHelper, request, tc} from 'helpers';
import {agileActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addEntityToContacts} from 'store/contacts/tasks';

/**
 * Create a deal
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
 * Get column for agile.
 */
export const getAgileColumns = async () => {
    try {
        const data = await request({
            method: 'get',
            url: '/agile/getAgile/',
        });

        if (data instanceof Error) {
            console.error('Error in getAgileColumns:\n' + data);
        }

        // Get column structure.
        let columns;
        if (!store.getState().agile.columnStructure ||
            (store.getState().agile.columnStructure && !store.getState().agile.columnStructure.length)) {
            columns = await getAgileColumnStructure();
        } else {
            columns = store.getState().agile.columnStructure;
        }

        // Add items array to each column.
        columns.map((column) => {
            column.items = [];
            return column;
        });

        // Place prospects in prospects column.
        // This column should always exists. Holds prospects that hasn't been turned into deals yet.
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
                    console.log('phaseMissingColumn', phaseMissingColumn);
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
        }

        return store.dispatch({ type: agileActionTypes.SET_AGILE_COLUMNS, payload: columns});
    } catch(err) {
        return console.error('Error in getAgileColumns:\n' + err);
    }
};

/**
 * Get agile column structure.
 */
const getAgileColumnStructure = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/agile/getColumnStructure/',
        });

        if (data instanceof Error || !data) {
            console.error('Could not get columns in getAgileColumnStructure:\n' + data);

            // Default deal phases/columns for a deal in bilprospekt-2.0.
            // First time a user uses Bearbeta in bilprospekt-3.0 they aren't going to have a column structure in db, so we use this.
            data = [
                {
                    id: 'prospects',
                    title: tc.prospects,
                },
                {
                    id: 'idle',
                    title: tc.notStarted,
                },
                {
                    id: 'todo',
                    title: tc.started,
                },
                {
                    id: 'contacted',
                    title: tc.contacted,
                },
                {
                    id: 'negotiation',
                    title: tc.negotiation,
                }
            ];
        }

        store.dispatch({ type: agileActionTypes.SET_AGILE_COLUMNSTRUCTURE, payload: data});
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
        const data = await request({
            method: 'get',
            url: '/agile/getFilters/',
        });

        if (data instanceof Error) {
            console.error('Error in getAgileFilters:\n' + data);
            let defaultFilters = agileHelper.getDefaultFilters();
            defaultFilters.map((num) => {
                num.active = false;
                return num;
            });
            return store.dispatch({ type: agileActionTypes.SET_AGILE_FILTERS, payload: defaultFilters});
        }

        return store.dispatch({ type: agileActionTypes.SET_AGILE_FILTERS, payload: data});
    } catch(err) {
        return console.error('Error in getAgileFilter:\n' + err);
    }
};

/**
 * Sort columns.
 */
export const sortColumns = (sort) => {
    let columns = store.getState().agile.columns;

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
                column.items = column.items.sort((a, b) => {
                    if (new Date(a.created) > new Date(b.created)){
                        return -1;
                    } else if (new Date(a.created) < new Date(b.created)){
                        return 1;
                    } else {
                        return 0;
                    }
                });
        }

        return column;
    });

    return store.dispatch({ type: agileActionTypes.SET_AGILE_COLUMNS, payload: columns});
};

/**
 * Update agile column structure.
 * @param payload
 */
export const updateAgileColumnStructure = async (payload) => {
    try {
        if (!payload) {
            return console.error('Missing params in updateColumnStructure');
        }

        // Kolla att kolumnen prospects finns med... vi ska ha check tidigare så man inte kan radera den, men ändå.

        const data = await request({
            method: 'post',
            url: '/agile/updateColumnStructure/', // skapa endpoint
        });


        if (data instanceof Error) {
            console.error('Error in updateColumnStructure:\n' + data);
        }

        console.log('data tillbaka i updateColumnStructure', data);

        // ...


    } catch(err) {
        return console.error('Error in updateColumnStructure:\n' + err);
    }
};

/**
 * Update agile filters.
 * @param payload
 */
export const updateAgileFilters = async (payload) => {
    try {

        // Skicka payload till backend, sedan sätt i state.agile.filters.

        // const data = await request({
        //     method: 'getasdasd',
        //     url: '/agile/getFilters/asdasdasdasd',
        // });

        // if (data instanceof Error) {
        //     return console.error('Error in updateAgileFilters:\n' + data);
        // }

        // return store.dispatch({ type: agileActionTypes.SET_AGILE_FILTERS, payload: data});
    } catch(err) {
        return console.error('Error in updateAgileFilter:\n' + err);
    }
};


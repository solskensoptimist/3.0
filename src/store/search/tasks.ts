import {store} from 'store';
import {searchActionTypes} from './actions';
import {request} from 'helpers';
import {debounce }from 'debounce';

/**
 * Get search suggestions for company, person and car.
 *
 * @param payload.limit - Limit rows.
 * @param payload.q - Search value.
 */
const getAllSuggestionsDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q)) {
            return console.error('Missing params in getAllSugestionsDebounced');
        }
        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        const data = await request({
            data: {
                limit: (payload.limit) ? payload.limit : 10,
                term: payload.q,
            },
            method: 'get',
            url: '/search/suggestSearch',
        });

        if (data instanceof Error) {
            return console.error('Error in getAllSuggestions.');
        }

        return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: data});
    } catch (err) {
        return console.error('Error in getAllSuggestions:\n' + err);
    }
};

/**
 * Return suggestions based on generic search for reg number.
 *
 * @param payload.q - Search query
 */
const getCarSuggestionsBasedOnRegNumberDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q)) {
            return console.error('Missing params in getCarSuggestionsBasedOnRegNumberDebounced');
        }

        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        let data = await request({
            data: {
                limit: (payload.limit) ? payload.limit : 10,
                term: payload.q,
            },
            method: 'get',
            url: '/search/suggestSearchCars',
        });

        if (!data || data instanceof Error || !data.results || (data && data.results && !data.results.length)) {
            console.error('No result in getCarSuggestionsBasedOnRegNumberDebounced', data);
            return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});
        }

        // No search term match required, already done backend.
        data = data.results.map((num) => {
            const model = (num.model ? num.model : num.real_trade_name.split(' ')[0]) || '';
            let name = num.brand + ' ' + model + ' (' + num.reg_number + ')';
            return {
                id: num.reg_number,
                name: name,
            }
        });

        return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: data});
    } catch (err) {
        return console.error('Error in getCarSuggestionsBasedOnRegNumberDebounced:\n' + err);
    }
};

/**
 * Return suggestions based on fleet for target, or generic search for reg number.
 *
 * @param payload.koncern (optional) - If we want cars for the whole koncern. Only possible when target is provided.
 * @param payload.q - Search query
 * @param payload.target (optional) - TS user id/orgnr. If not provided, generic search for reg number is done.
 */
const getCarSuggestionsBasedOnTargetDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q)) {
            return console.error('Missing params in getCarSuggestionsBasedOnTargetDebounced ');
        }

        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        let data = await request({
            data: {
                koncern: payload.koncern ? 1 : 0,
                limit: (payload.limit) ? payload.limit : 10,
                term: payload.q,
            },
            method: 'get',
            url: '/fleet/' + payload.target,
        });

        if (!data || data instanceof Error || !data.results || (data && data.results && !data.results.length)) {
            console.error('No result in getCarSuggestionsBasedOnTargetDebounced ', data);
            return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});
        }

        data = data.results.filter((num) => {
                const model = (num.model ? num.model : num.real_trade_name.split(' ')[0]) || '';
                let name = num.brand + ' ' + model + ' (' + num.reg_number + ')';
                return (name.toLowerCase().indexOf(payload.q.toLowerCase()) !== -1); // Match search.
            })
            .map((num) => {
                const model = (num.model ? num.model : num.real_trade_name.split(' ')[0]) || '';
                let name = num.brand + ' ' + model + ' (' + num.reg_number + ')';
                return {
                    id: num.reg_number,
                    name: name,
                }
            });

        return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: data});
    } catch (err) {
        return console.error('Error in getCarSuggestionsBasedOnTargetDebounced :\n' + err);
    }
};


/**
 * Get footer_contact suggestions.
 *
 * @param payload.q
 */
const getContactSuggestionsDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q)) {
            return console.error('Missing params in getContactsSuggestionsDebounced');
        }

        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        let data = await request({
            data: {
                name: payload.q,
            },
            method: 'get',
            url: '/contacts',
        });

        if (data instanceof Error) {
            return console.error('Error in getContactSuggestions.');
        }

        return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: data});
    } catch (err) {
        return console.error('Error in getContactSuggestions:\n' + err);
    }
};

/**
 * Return suggestions for koncern companies.
 *
 * @param payload.q
 * @param payload.target - The companyorg nr, doesn't have to be parent company, can be a company within a koncern.
 */
const getKoncernCompaniesSuggestionsDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q) || (payload && !payload.target)) {
            return console.error('Missing params in getKoncernCompanySuggestionsDebounced');
        }

        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        let data = await request({
            method: 'get',
            url: '/api/koncern/' + payload.target,
        });

        if (data && data.structure && data.structure.length) {
            data = data.structure
                .filter((num) => (num && num.name.toLowerCase().indexOf(payload.q.toLowerCase()) !== -1)) // Match search.
                .map((num) => {
                    return {
                        id: num.id,
                        name: num.name,
                    }
                });
        }

        return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: data});
    } catch (err) {
        return console.error('Error in getKoncernCompanySuggestionsDebounced:\n' + err);
    }
};

/**
 * Debounce and export suggestions calls.
 */
export const getAllSuggestions = debounce(getAllSuggestionsDebounced, 300);
export const getCarSuggestionsBasedOnRegNumber = debounce(getCarSuggestionsBasedOnRegNumberDebounced, 300);
export const getCarSuggestionsBasedOnTarget = debounce(getCarSuggestionsBasedOnTargetDebounced, 300);
export const getContactSuggestions = debounce(getContactSuggestionsDebounced, 300);
export const getKoncernCompaniesSuggestions = debounce(getKoncernCompaniesSuggestionsDebounced, 200);

/**
 * Redirect to search result view.
 *
 * @param payload.q - Search value
 */
export const redirectSearch = async (payload) => {
    resetSearch();
    if (payload.q && payload.q.length) {
        return window.location.href = '/sok/' + payload.q;
    }
};

/**
 * Empty search suggestions array.
 */
export const resetSearch = () => {
    return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});
};

/**
 * Empty selected array.
 *
 * @param payload.type
 */
export const resetSelected = (payload) => {
    switch (payload.type) {
        case 'all':
            return store.dispatch({type: searchActionTypes.SET_SELECTED_ALL, payload: []});
        case 'cars':
            return store.dispatch({type: searchActionTypes.SET_SELECTED_CARS, payload: []});
        case 'contacts':
            return store.dispatch({type: searchActionTypes.SET_SELECTED_CONTACTS, payload: []});
        case 'koncernCompanies':
            return store.dispatch({type: searchActionTypes.SET_SELECTED_KONCERN_COMPANIES, payload: []});
        default:
            return console.error('Missing type in resetSelected.');
    }
};

/**
 * Toggle an object in selected array.
 *
 * @param payload.obj - Object that will be added/removed.
 * @param payload.type - Determines which selected array to change.
 */
export const toggleSelected = (payload) => {
    switch (payload.type) {
        case 'all':
            let selectedAll = store.getState().search.selectedAll;

            if (selectedAll.find((num) => num.id === payload.obj.id)) {
                selectedAll = selectedAll.filter((num) => num.id !== payload.obj.id);
            } else {
                selectedAll.push(payload.obj);
            }

            return store.dispatch({type: searchActionTypes.SET_SELECTED_ALL, payload: selectedAll});
        case 'cars':
            let selectedCars = store.getState().search.selectedCars;

            if (selectedCars.find((num) => num.id === payload.obj.id)) {
                selectedCars = selectedCars.filter((num) => num.id !== payload.obj.id);
            } else {
                selectedCars.push(payload.obj);
            }

            return store.dispatch({type: searchActionTypes.SET_SELECTED_CARS, payload: selectedCars});
        case 'contacts':
            let selectedContacts = store.getState().search.selectedContacts;

            if (selectedContacts.find((num) => num._id === payload.obj._id)) {
                selectedContacts = selectedContacts.filter((num) => num._id !== payload.obj._id);
            } else {
                selectedContacts.push(payload.obj);
            }

            return store.dispatch({type: searchActionTypes.SET_SELECTED_CONTACTS, payload: selectedContacts});
        case 'koncernCompanies':
            let selectedKoncernCompanies = store.getState().search.selectedKoncernCompanies;

            if (selectedKoncernCompanies.find((num) => num.id === payload.obj.id)) {
                selectedKoncernCompanies = selectedKoncernCompanies.filter((num) => num.id !== payload.obj.id);
            } else {
                selectedKoncernCompanies.push(payload.obj);
            }

            return store.dispatch({type: searchActionTypes.SET_SELECTED_KONCERN_COMPANIES, payload: selectedKoncernCompanies});
        default:
            return console.error('Missing type in toggleSelected.');
    }
};

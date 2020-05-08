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
                limit: (payload.limit) ? payload.limit : 8,
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
 * Return suggestions for koncern companies.
 *
 * @param payload.companyId
 * @param payload.koncern
 * @param payload.q
 */
const getCompanyCarSuggestionsDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q) || (payload && !payload.companyId)) {
            return console.error('Missing params in getCompanyCarSuggestionsDebounced');
        }

        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        // BYGG OCH ANVÄND NY ENDPOINT HÄR, NUVARANDE ÄR LÅNGSAM OCH TVEKSAMT OM DEN RETURNERAR RESULTAT FÖR KONCERNBOLAG.
        let data = await request({
            data: {
                koncern: payload.isKoncern ? 1 : 0,
                term: payload.q,
            },
            method: 'get',
            url: '/fleet/' + payload.companyId,
        });

        if (!data || data instanceof Error || !data.results || (data && data.results && !data.results.length)) {
            console.error('No result in getCompanyCarSuggestionsDebounced', data);
            return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});
        }

        data = data.results
            .filter((num) => {
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
        return console.error('Error in getCompanyCarSuggestionsDebounced:\n' + err);
    }
};

/**
 * Return suggestions for koncern companies.
 *
 * @param payload.companyId
 * @param payload.q
 */
const getKoncernCompaniesSuggestionsDebounced = async (payload) => {
    try {
        if (!payload || (payload && !payload.q) || (payload && !payload.companyId)) {
            return console.error('Missing params in getKoncernCompanySuggestionsDebounced');
        }

        store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});

        let data = await request({
            method: 'get',
            url: '/api/koncern/' + payload.companyId,
        });

        if (data && data.structure && data.structure.length) {
            data = data.structure
                .filter((num) => (num && num.name.toLowerCase().indexOf(payload.q.toLowerCase()) !== -1)) // Company name match search?
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
 * Get contact suggestions.
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

        data = data.map((num) => {
            if (num._id) {
                num.id = num._id; // To keep it consistent when rendering in search component.
                delete num._id;
            }
            return num;
        }).filter((num) => !!(num.id)); // Overly cautious. :)

        return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: data});
    } catch (err) {
        return console.error('Error in getContactSuggestions:\n' + err);
    }
};

/**
 * Debounce and export suggestions calls.
 */
export const getAllSuggestions = debounce(getAllSuggestionsDebounced, 300);
export const getCompanyCarSuggestions = debounce(getCompanyCarSuggestionsDebounced, 300);
export const getKoncernCompaniesSuggestions = debounce(getKoncernCompaniesSuggestionsDebounced, 200);
export const getContactSuggestions = debounce(getContactSuggestionsDebounced, 300);

/**
 * Redirect to search result view.
 *
 * @payload.q - Search value
 */
export const redirectSearch = async (payload) => {
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
 */
export const resetSelected = () => {
    return store.dispatch({type: searchActionTypes.SET_SELECTED, payload: []});
};

/**
 * Toggle a value in selected array.
 *
 * @payload.id
 * @payload.name
 */
export const toggleSelected = (payload) => {
    let selected = store.getState().search.selected;

    if (selected.find((num) => num.id === payload.id)) {
        selected = selected.filter((num) => num.id !== payload.id);
    } else {
        selected.push(payload);
    }

    return store.dispatch({type: searchActionTypes.SET_SELECTED, payload: selected});
};

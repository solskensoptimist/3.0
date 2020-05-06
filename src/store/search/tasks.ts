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

export const getAllSuggestions = debounce(getAllSuggestionsDebounced, 300);

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

export const resetSearch = () => {
    return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});
};

/**
 * Toggle a value in selectedAll array.
 *
 * @param id
 */
export const toggleSelectAll = (id) => {
    let selected = store.getState().search.selectedAll;

    if (selected.includes(id)) {
        selected = selected.filter((x) => x !== id);
    } else {
        selected.push(id);
    }

    return store.dispatch({type: searchActionTypes.SET_SELECTED_ALL, payload: selected});
};

/**
 * Toggle a value in selectedContacts array.
 *
 * @param id
 */
export const toggleSelectContacts = (id) => {
    let selected = store.getState().search.selectedContacts;

    if (selected.includes(id)) {
        selected = selected.filter((x) => x !== id);
    } else {
        selected.push(id);
    }

    return store.dispatch({type: searchActionTypes.SET_SELECTED_CONTACTS, payload: selected});
};

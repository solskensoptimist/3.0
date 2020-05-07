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
 * Get contact suggestions.
 *
 * @param payload.q
 */
const getContactSuggestionsDebounced = async (payload) => {
    try {
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
 * Debounce suggestions calls.
 */
export const getAllSuggestions = debounce(getAllSuggestionsDebounced, 300);
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

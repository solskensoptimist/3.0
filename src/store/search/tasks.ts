import {store} from 'store';
import {searchActionTypes} from './actions';
import {request} from 'helpers';

export const cleanSearch = () => {
    // Lägg till mer här... clean up q mm.
    return store.dispatch({type: searchActionTypes.SET_SEARCH_SUGGESTIONS, payload: []});
};

/**
 * Get search suggestions for company, person and car.
 *
 * @param payload.limit - Limit rows.
 * @param payload.q - Search value.
 */
export const getAllSuggestions = async (payload) => {
    // Lägg till debounce... <----------------------------- !!!!

    try {
        const data = await request({
            data: {
                limit: payload.limit,
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
 * Redirect to search prospect_result table.
 *
 * @payload.q - Search value
 */
export const redirectSearch = async (payload) => {
    if (payload.q && payload.q.length) {
        return window.location.href = '/sok/' + payload.q;
    }
};

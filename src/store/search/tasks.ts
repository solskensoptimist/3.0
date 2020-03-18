import {store} from 'store';
import {searchActionTypes} from "./actions";

/**
 * Set show search.
 *
 * @param payload.showSearch
 */
export const setShowSearch = (payload) => {
    return store.dispatch({ type: searchActionTypes.SET_SHOW_SEARCH, payload: payload });
};

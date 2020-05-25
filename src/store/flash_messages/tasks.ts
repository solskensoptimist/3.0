import {store} from 'store';
import {flashMessagesActionTypes} from './actions';

export const showFlashMessage = (payload) => {
    store.dispatch({type: flashMessagesActionTypes.SET_MESSAGE, payload: payload});
    store.dispatch({type: flashMessagesActionTypes.SET_SHOW_MESSAGE, payload: true});

    return setTimeout(() => {
        store.dispatch({type: flashMessagesActionTypes.SET_SHOW_MESSAGE, payload: false});
    }, 5000);
};

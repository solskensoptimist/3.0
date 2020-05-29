import {store} from 'store';
import {flashMessagesActionTypes} from './actions';

export const showFlashMessage = (payload) => {
    store.dispatch({type: flashMessagesActionTypes.SET_MESSAGE, payload: payload});
    store.dispatch({type: flashMessagesActionTypes.SET_SHOW_MESSAGE, payload: true});

    return setTimeout(() => {
        store.dispatch({type: flashMessagesActionTypes.SET_SHOW_MESSAGE, payload: false});
    }, 7000); // Use same ms as we use in sass animation for class .__flashMessagesWrapper__flashMessages
};

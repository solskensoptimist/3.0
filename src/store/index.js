import {createStore, combineReducers} from 'redux';
import {groupsReducer} from 'store/groups/reducer';
import {prospectReducer} from 'store/prospect/reducer';
import {settingsReducer} from 'store/settings/reducer';
import {userReducer} from 'store/user/reducer';

// All reducers combined.
const reducer = combineReducers({
    groups: groupsReducer,
    prospect: prospectReducer,
    settings: settingsReducer,
    user: userReducer,
});

/**
 * Saves the redux state to local storage.
 */
const saveToLocalStorage = (state) => {
    // Because of different browsers and privacy mode, it might not save to local storage - hence try/catch.
    try {
        // JSON format state.
        const currentState = JSON.stringify(state);
        // Set it as "bilprospekt" in local storage.
        localStorage.setItem('bilprospekt', currentState);
    } catch(error) {
        console.error('Error in saveToLocalStorage', error);
    }
};

/**
 * * Returns "state" from local storage if exists. Used as argument/key when creating store.
 */
const loadFromLocalStorage = () => {
    // Because of different browsers and privacy mode, it might not save to local storage - hence try/catch.
    try {
        const currentState = localStorage.getItem('bilprospekt');
        if (currentState === null) {
            // Redux expects undefined in this case, null causes error.
            return undefined;
        } else {
            // Successful -> return state from local storage.
            return JSON.parse(currentState);
        }
    } catch(error) {
        console.error('Error in loadFromLocalStorage', error);
        return undefined;
    }
};


// Creating redux store.
const store = createStore(reducer, loadFromLocalStorage());

// Subscriptions.
store.subscribe(() => saveToLocalStorage(store.getState()));
store.subscribe(() =>  console.log("Store", store.getState()));

export {store};

import {createStore, combineReducers} from 'redux';
import {activityReducer} from 'store/activity/reducer';
import {agileReducer} from 'store/agile/reducer';
import {commentReducer} from 'store/comment/reducer';
import {companyReducer} from 'store/company/reducer';
import {contactsReducer} from 'store/contacts/reducer';
import {dealReducer} from 'store/deal/reducer';
import {eventsReducer} from 'store/events/reducer';
import {filterReducer} from 'store/filter/reducer';
import {fleetReducer} from 'store/fleet/reducer';
import {flashMessagesReducer} from 'store/flash_messages/reducer';
import {groupsReducer} from 'store/groups/reducer';
import {listsReducer} from 'store/lists/reducer';
import {personReducer} from 'store/person/reducer';
import {prospectReducer} from 'store/prospect/reducer';
import {searchReducer} from 'store/search/reducer';
import {settingsReducer} from 'store/settings/reducer';
import {userReducer} from 'store/user/reducer';

// All reducers combined.
const reducer = combineReducers({
    activity: activityReducer,
    agile: agileReducer,
    comment: commentReducer,
    company: companyReducer,
    contacts: contactsReducer,
    deal: dealReducer,
    events: eventsReducer,
    filter: filterReducer,
    fleet: fleetReducer,
    flashMessages: flashMessagesReducer,
    groups: groupsReducer,
    lists: listsReducer,
    person: personReducer,
    prospect: prospectReducer,
    search: searchReducer,
    settings: settingsReducer,
    user: userReducer,
});

/**
 * Saves the redux state to local storage.
 */
const saveToLocalStorage = (state, action) => {
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

const rootReducer = (state, action) => {
    if (action.type === 'CLEAR_STATE') {
        state = undefined;
    }

    return reducer(state, action);
};

// Creating redux store.
const store = createStore(rootReducer, loadFromLocalStorage());

// Subscriptions.
store.subscribe(() => saveToLocalStorage(store.getState()));
store.subscribe(() =>  console.log("Store", store.getState()));

export {store};

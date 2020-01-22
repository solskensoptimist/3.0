import {createStore, combineReducers} from 'redux';
import {groupsReducer} from 'store/groups/reducer';
import {prospectReducer} from 'store/prospect/reducer';
import {userReducer} from 'store/user/reducer';

// All reducers combined.
const reducer = combineReducers({
    groups: groupsReducer,
    prospect: prospectReducer,
    user: userReducer,
});

// Creating redux store.
const store = createStore(reducer);

// Subscription.
store.subscribe(() => {
    return console.log("Store", store.getState());
});

export {store};

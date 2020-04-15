import {groupsActionTypes} from './actions';

interface GroupsState {
    dealer: Array<object> | null,
    region: Array<object> | null,
}

const initialState: GroupsState = {
    dealer: null,
    region: null,
};

export const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
        case groupsActionTypes.SET_GROUPS: {
            return {
                ...state,
                data: action.payload
            }
        }
        default: {
            return state;
        }
    }
};

import {groupsActionTypes} from './actions';

const initialState = {
    dealer: [],
    region: [],
};

export const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
        case groupsActionTypes.GET_GROUPS: {
            console.log('action.payload:', action.payload);
            return state // Uppdatera grupper här... (hur gör för olika grupper?)
        }
        default: {
            return state;
        }
    }
};

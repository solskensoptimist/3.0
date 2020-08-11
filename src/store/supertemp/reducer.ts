import {supertempActionTypes} from './actions';

interface SupertempState {
    subscriptions: object,
}

const initialState: SupertempState = {
    subscriptions: {},
};

export const supertempReducer = (state = initialState, action) => {
    switch(action.type) {
        case supertempActionTypes.SET_SUPERTEMP: {
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    [action.payload.id]: action.payload.data,
                },
            }
        }
        default: {
            return state;
        }
    }
};

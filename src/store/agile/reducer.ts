import {agileActionTypes} from './actions';

interface AgileState {
    columns: object | null,
}

const initialState: AgileState = {
    columns: null,
};

export const agileReducer = (state = initialState, action) => {
    switch(action.type) {
        default: {
            return state;
        }
    }
};

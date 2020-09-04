import {agileActionTypes} from './actions';

interface AgileState {
    columns: Array<object> | null,
    filters: object | null,
    sort: string | null,
}

const initialState: AgileState = {
    columns: null,
    filters: null,
    sort: null,
};

export const agileReducer = (state = initialState, action) => {
    switch(action.type) {
        case agileActionTypes.SET_COLUMNS: {
            return {
                ...state,
                columns: action.payload,
            }
        }
        case agileActionTypes.SET_FILTERS: {
            return {
                ...state,
                filters: action.payload,
            }
        }
        case agileActionTypes.SET_SORT: {
            return {
                ...state,
                sort: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

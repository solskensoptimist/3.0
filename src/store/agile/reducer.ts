import {agileActionTypes} from './actions';

interface AgileState {
    columns: Array<object>| null,
    columnStructure: Array<object>| null,
    filters: object | null,
    sort: string | null,
}

const initialState: AgileState = {
    columns: null,
    columnStructure: null,
    filters: null,
    sort: null,
};

export const agileReducer = (state = initialState, action) => {
    switch(action.type) {
        case agileActionTypes.SET_AGILE_COLUMNS: {
            return {
                ...state,
                columns: action.payload,
            }
        }
        case agileActionTypes.SET_AGILE_COLUMNSTRUCTURE: {
            return {
                ...state,
                columnStructure: action.payload,
            }
        }
        case agileActionTypes.SET_AGILE_FILTERS: {
            return {
                ...state,
                filters: action.payload,
            }
        }
        case agileActionTypes.SET_AGILE_SORT: {
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

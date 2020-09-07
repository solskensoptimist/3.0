import {agileActionTypes} from './actions';

interface AgileState {
    allProspectsReceived: boolean,
    columns: Array<object> | null,
    filters: object | null,
    previewItem: string | null,
    sort: string | null,
}

const initialState: AgileState = {
    allProspectsReceived: true,
    columns: null,
    filters: null,
    previewItem: null,
    sort: null,
};

export const agileReducer = (state = initialState, action) => {
    switch(action.type) {
        case agileActionTypes.SET_ALL_PROSPECTS_RECEIVED: {
            return {
                ...state,
                allProspectsReceived: action.payload,
            }
        }
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
        case agileActionTypes.SET_PREVIEW_ITEM: {
            return {
                ...state,
                previewItem: action.payload,
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

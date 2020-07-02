import english from './english';
import swedish from './swedish';
import {store} from 'store';

const state = store.getState();
let tc;

if (state && state.user && state.user.info) {
    switch (state.user.info.lang.toLowerCase()) {
        case 'swe':
            tc = swedish;
            break;
        case 'en':
            tc = english;
            break;
        default:
            tc = swedish;
    }
} else {
    tc = swedish;
}

export {tc};

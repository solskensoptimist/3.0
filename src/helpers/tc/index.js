import {store} from 'store';
import english from './english';
import norwegian from './norwegian';
import swedish from './swedish';

const lang = store.getState().user.lang;
let tc;

if (lang) {
    switch (lang.toLowerCase()) {
        case 'sv':
            tc = swedish;
            break;
        case 'en':
            tc = english;
            break;
        case 'no':
            tc = norwegian;
            break;
        default:
            tc = swedish;
    }
} else {
    tc = swedish;
}

export {tc};

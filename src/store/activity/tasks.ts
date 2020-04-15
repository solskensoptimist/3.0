import {store} from 'store';
import {request} from 'helpers';
import {activityActionTypes} from './actions';

/**
 * Retrieve one deal.
 */
export const getActivity = async (payload) => {

    /*
    Kolla vad som skickas med, ska vi hämta för en deal, för ett prospekt(?) för andra filter?
    Eller allt för en användare...

    Behöver troligtvis skapa en filter store först...
    store.getState().filter borde fungera..?
     */

    if (!payload || !payload.id) {
        return console.error('Missing params in getDeal');
    }

    request({
        method: 'get',
        // url: '/deals/' + payload.id,
    })
        .then((data) => {

            return store.dispatch({ type: activityActionTypes.SET_ACTIVITY, payload: {activity: data} });
        })
        .catch((err) => {
            return console.error('Error in getDeal:', err);
        });
};
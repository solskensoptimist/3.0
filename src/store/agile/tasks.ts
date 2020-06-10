import {store} from 'store';
import {request, tc} from 'helpers';
import {agileActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';

/**
 * Create a deal
 *
 * @param payload....
 */
export const createDeal = async (payload) => {
    try {
        // cars: []
        // comments: ""
        // contacts: [{_id: "-1", name: "Martin Styf", tele: ["031-3821700"], email: [], comment: "Befattningshavare",…},…]
        // description: "Beskrivning av aggär"
        // maturity: 3
        // name: "Namnet"
        // phase: "idle"
        // prospects: ["5566524301"]
        // responsible: null

        // const data = await request({
        //     data: {
        //         cars: payload.cars ? payload.cars : [],
        //         comments: '', // Deprecated property
        //         contacts: payload.contacts ? payload.contacts : [],
        //         description: payload.description ? payload.description : '',
        //         maturity: payload.maturity ? payload.maturity : null,
        //         name: payload.name ? payload.name : null,
        //         phase: 'idle',
        //         prospects: payload.prospects ? payload.prospects : [],
        //         responsible: payload.responsible ? payload.responsible : null,
        //     },
        //     method: 'post',
        //     url: '/deals/',
        // });

        // if (!data || data instanceof Error) {
        //     showFlashMessage(tc.couldNotCreateDeal);
        //     console.error('Could not create deal:\n' + data);
        // }

        // Ska vi använda callback eller hur uppdaterar jag data?
        // parameter, reloadAgile standard true?

        return showFlashMessage(tc.dealWasCreated);
    } catch(err) {
        return console.error('Error in createDeal:\n' + err);
    }
};

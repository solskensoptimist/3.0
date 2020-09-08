import {tc} from 'helpers';

export const dealHelper = {
    getMaturityList: () => {
        return [
            {id: 0, name: '-'},
            {id: 1, name: tc.iceCold},
            {id: 2, name: tc.cold},
            {id: 3, name: tc.lukewarm},
            {id: 4, name: tc.hot},
            {id: 5, name: tc.veryHot},
        ];
    },
    getMaturityName: (id) => {
        const arr = dealHelper.getMaturityList().filter((num) => (Number(id) === num.id));
        if (arr && arr[0] && arr[0].name) {
            return arr[0].name;
        } else {
            return tc.maturity;
        }
    },
    getReadablePhase: (phase) => {
        if (!phase) {
            return '';
        }
        switch (phase) {
            case 'idle':
                return tc.idle;
            case 'todo':
                return tc.todo;
            case 'contacted':
                return tc.contacted;
            case 'negotiation':
                return tc.negotiation;
            case 'won':
                return tc.won;
            case 'lost':
                return tc.lost;
            case 'trash':
                return tc.trash;
            default:
                return phase.charAt(0).toUpperCase() + phase.slice(1).replace(/[-]/ig, " ");
        }
    },
};

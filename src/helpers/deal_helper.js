import {tc} from 'helpers';

export const dealHelper = {
    getReadablePhase: (phase) => {
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
                return phase;
        }
    },
};

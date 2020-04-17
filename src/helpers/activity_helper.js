import {tc} from 'helpers';

export const activityHelper = {
    getReadableActivity: (activity) => {
        switch (activity) {
            case 'won':
                return tc.won;
            case 'lost':
                return tc.lost;
            case 'call':
                return tc.call;
            case 'meeting':
                return tc.meeting;
            case 'mail':
                return tc.mail;
            case 'testride':
                return tc.testride;
            case 'valuation':
                return tc.valuation;
            case 'offer':
                return tc.offert;
            case 'analysis':
                return tc.analysis;
            case 'visit':
                return tc.visit;
            case 'other':
                return tc.other;
            case 'owner':
                return tc.changedOwner;

            // Deprecated?
            case 'will_mail':
                return tc.willEmail;
            case 'will_email':
                return tc.willEmail;
            case 'will_meeting':
                return tc.willMeeting;
            case 'will_call':
                return tc.willCall;
            case 'will_post':
                return tc.willPost;
            case 'did_email':
                return tc.didEmail;
            case 'did_call':
                return tc.didCall;
            case 'did_post':
                return tc.didPost;
            case 'did_meeting':
                return tc.didMeeting;
            case 'did_lose_price':
                return tc.didLosePrice;
            case 'did_lose_unknown':
                return tc.didLoseUnknown;
            case 'did_lose_window':
                return tc.didLoseWindow;
            case 'did_lose_product':
                return tc.didLoseProduct;

            default:
                return activity;
        }
    },
};

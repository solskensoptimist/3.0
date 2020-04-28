import {tc} from 'helpers';

export const activityHelper = {
    getReadableActivity: (activity) => {
        switch (activity) {
            case 'analysis':
                return tc.analysis;
            case 'call':
                return tc.call;
            case 'comment':
                return tc.comment;
            case 'lost':
                return tc.lost;
            case 'mail':
                return tc.mail;
            case 'meeting':
                return tc.meeting;
            case 'move':
                return tc.moved;
            case 'offer':
                return tc.offert;
            case 'other':
                return tc.other;
            case 'owner':
                return tc.changedOwner;
            case 'testride':
                return tc.testride;
            case 'valuation':
                return tc.valuation;
            case 'visit':
                return tc.visit;
            case 'won':
                return tc.won;

            // Deprecated?
            case 'did_call':
                return tc.didCall;
            case 'did_email':
                return tc.didEmail;
            case 'did_lose_price':
                return tc.didLosePrice;
            case 'did_lose_unknown':
                return tc.didLoseUnknown;
            case 'did_lose_window':
                return tc.didLoseWindow;
            case 'did_lose_product':
                return tc.didLoseProduct;
            case 'did_meeting':
                return tc.didMeeting;
            case 'did_post':
                return tc.didPost;
            case 'will_call':
                return tc.willCall;
            case 'will_mail':
                return tc.willEmail;
            case 'will_email':
                return tc.willEmail;
            case 'will_meeting':
                return tc.willMeeting;
            case 'will_post':
                return tc.willPost;

            default:
                return activity;
        }
    },
    getPreposition: (activity) => {
        switch (activity) {
            case 'call':
                return tc.to;
            case 'did_call':
                return tc.to;
            case 'will_call':
                return tc.to;
            case 'mail':
                return tc.to;
            case 'did_mail':
                return tc.to;
            case 'will_mail':
                return tc.to;
            case 'email':
                return tc.to;
            case 'will_email':
                return tc.to;
            case 'did_post':
                return tc.to;
            case 'will_post':
                return tc.to;
            case 'ofofer':
                return tc.to;
            case 'meeting':
                return tc.with;
            case 'testrider':
                return tc.with;
            case 'analysis':
                return tc.for;
            case 'valuation':
                return tc.for;
            case 'visit':
                return tc.at;
            default:
                return tc.regarding;
        }
    },
};

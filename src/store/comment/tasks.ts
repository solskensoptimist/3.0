import {store} from 'store';
import {request, requestWithBody} from 'helpers';
import {commentActionTypes} from './actions';
import {getActivity} from 'store/activity/tasks';

/**
 * Retrieve one Comment
 *
 * @param payload.id
 */
export const getComment = async (payload) => {
    if (!payload || (payload && !payload.id)) {
        return console.error('Missing params in getComment:\n' + payload);
    }

    try {
        const comment = await request({
            method: 'get',
            url: '/comments/comment/' + payload.id,
        });

        if (!comment || comment instanceof Error) {
            console.error('No data in getComment');
            return store.dispatch({ type: commentActionTypes.SET_COMMENT, payload: {}});
        }

        await store.dispatch({ type: commentActionTypes.SET_COMMENT, payload: {...comment}});
        return;
    } catch(err) {
        return console.error('Error in getComment:', err);
    }
};

/**
 * Remove one comment.
 *
 * @param payload.comment
 * @param payload.target
 */
export const removeComment = async (payload) => {
    if (!payload || (payload && !payload.id)) {
        return console.error('Missing params in removeComment:\n' + payload);
    }

    try {
        const comment = await requestWithBody({
            data: {
                comment_id: payload.id.toString(),
            },
            method: 'delete',
            url: '/comments/',
        });

        if (!comment || comment instanceof Error) {
            return console.error('Error in removeComment');
        }

        // Update activities.
        await getActivity({type: 'last'});

        return;
    } catch(err) {
        return console.error('Error in removeComment:', err);
    }
};

/**
 * Save new comment.
 *
 * @param payload.comment
 * @param payload.target
 */
export const saveComment = async (payload) => {
    if (!payload || (payload && !payload.target) || (payload && !payload.comment)) {
        return console.error('Missing params in saveComment:\n' + payload);
    }

    try {
        const comment = await request({
            data: {
                comment: payload.comment,
                target_id: payload.target,
            },
            method: 'post',
            url: '/comments/',
        });

        if (!comment || comment instanceof Error) {
            return console.error('Error in saveComment');
        }

        // Update activities.
        await getActivity({type: 'last'});

        return;
    } catch(err) {
        return console.error('Error in saveComment:', err);
    }
};

/**
 * Update existing comment.
 *
 * @param payload.id
 * @param payload.comment
 */
export const updateComment = async (payload) => {
    if (!payload || (payload && !payload.id) || (payload && !payload.comment)) {
        return console.error('Missing params in updateComment:\n' + payload);
    }

    try {
        const comment = await request({
            data: {
                comment: payload.comment,
                comment_id: payload.id,
            },
            method: 'put',
            url: '/comments/',
        });

        if (!comment || comment instanceof Error) {
            return console.error('Error in updateComment');
        }

        // Update activities.
        await getActivity({type: 'last'});

        return store.dispatch({ type: commentActionTypes.SET_COMMENT_COMMENT, payload: {comment: payload.comment}});
    } catch(err) {
        return console.error('Error in updateComment:', err);
    }
};

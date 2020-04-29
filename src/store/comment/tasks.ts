import {store} from 'store';
import {request} from 'helpers';
import {commentActionTypes} from './actions';

/**
 * Retrieve one Comment
 */
export const getComment = async (payload) => {
    if (!payload || (payload && !payload.id)) {
        return console.error('Missing params in getComment');
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
 * Save new comment.
 *
 * @param payload.comment
 * @param payload.target
 */
export const saveComment = async (payload) => {
    if (!payload || (payload && !payload.target) || (payload && !payload.comment)) {
        return console.error('Missing params in saveComment');
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
        return console.error('Missing params in updateComment');
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

        return store.dispatch({ type: commentActionTypes.SET_COMMENT_COMMENT, payload: {comment: payload.comment}});
    } catch(err) {
        return console.error('Error in updateComment:', err);
    }
};

/*
Det går att uppdatera en enskild, radera en enskild, och skapa en enskild.
Det enda som saknas är att hämta en enskild.

Comments/routers.js

router.route('/')
    .all(isAuthenticated.rest)
    .delete(function(req, res, next) {
        var id = req.body.comment_id;
        if(!id) {
            res.status(400).send('Invalid parameters');
            return;
        }
        commentsModel.deleteComment(id)
            .then(function() {
                res.send(true);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });

    });
*/

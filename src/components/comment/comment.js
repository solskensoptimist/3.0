import React from 'react';
import CommentEdit from './comment_edit';
import CommentNew from './comment_new';
import CommentRemove from './comment_remove';

/**
 * Render component for new comment, edit comment or remove comment.
 *
 * @param props.close - func
 * @param props.headline - string
 * @param props.id - number - When edit or remove.
 * @param props.target - number - When new.
 */
export default (props) => {
    switch (props.type) {
        case 'new':
            if (props.target) {
                return <CommentNew close={props.close} headline={props.headline} target={props.target}/>;
            } else {
                return console.error('Missing props.target for Comment');
            }
        case 'edit':
            if (props.id) {
                return <CommentEdit close={props.close} headline={props.headline} id={props.id}/>;
            } else {
                return console.error('Missing props.id for Comment');
            }
        case 'remove':
            if (props.id) {
                return <CommentRemove close={props.close} headline={props.headline}  id={props.id}/>;
            } else {
                return console.error('Missing props.id for Comment');
            }
        default:
            if (props.target) {
                return <CommentNew close={props.close} headline={props.headline} target={props.target}/>;
            } else {
                return console.error('Missing props.target for Comment');
            }
    }
}

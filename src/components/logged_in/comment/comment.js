import React from 'react';
import CommentEdit from './comment_edit';
import CommentNew from './comment_new';
import CommentRemove from './comment_remove';

export default (props) => {
    switch (props.type) {
        case 'new':
            if (props.target) {
                return <CommentNew close={props.close ? props.close : null}  target={props.target} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.target for Comment');
            }
        case 'edit':
            if (props.id) {
                return <CommentEdit close={props.close ? props.close : null}   id={props.id} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.id for Comment');
            }
        case 'remove':
            if (props.id) {
                return <CommentRemove close={props.close ? props.close : null}  id={props.id} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.id for Comment');
            }
        default:
            if (props.target) {
                return <CommentNew close={props.close ? props.close : null}   target={props.target} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.target for Comment');
            }
    }
}

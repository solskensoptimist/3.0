import React from 'react';
import CommentEdit from './comment_edit';
import CommentNew from './comment_new';

export default (props) => {
    switch (props.type) {
        case 'new':
            if (props.target) {
                return <CommentNew close={props.close} target={props.target} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.target for Comment');
            }
        case 'edit':
            if (props.id) {
                return <CommentEdit close={props.close}  id={props.id} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.id for Comment');
            }
        default:
            if (props.target) {
                return <CommentNew close={props.close}  target={props.target} update={props.update ? props.update : null}/>;
            } else {
                return console.error('Missing props.target for Comment');
            }
    }
}

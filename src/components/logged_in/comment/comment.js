import React from 'react';
import CommentEdit from './comment_edit';
import CommentNew from './comment_new';

export default (props) => {
    // Behöver props.target, antingen deal eller prospekt id.

    switch (props.type) {
        case 'new':
            return <CommentNew target={props.target}/>;
        case 'edit':
            return <CommentEdit id={props.id}/>;
        default:
            return <CommentNew target={props.target}/>;
    }
}

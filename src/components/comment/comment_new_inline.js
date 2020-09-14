import React, {useRef, useState} from 'react';
import {tc} from 'helpers';
import {saveComment} from 'store/comment/tasks';

const CommentNewInline = (props) => {
    const [text, setText] = useState('');
    const commentNewTextRef = useRef(null);

    const _onChange = () => {
        if (commentNewTextRef && commentNewTextRef.current && commentNewTextRef.current.value) {
            setText(commentNewTextRef.current.value);
        }
    };

    const _saveComment = async () => {
        if (commentNewTextRef && commentNewTextRef.current && commentNewTextRef.current.value) {
            await saveComment({comment: commentNewTextRef.current.value, target: props.target});
        }
    };

    return (
        <div className='commentInlineWrapper'>
            <div className='commentInlineWrapper__commentInline'>
                <div className='commentInlineWrapper__commentInline__content'>
                    <textarea onChange={_onChange} ref={commentNewTextRef} placeholder={tc.comment} value={text}/>
                </div>
                <div className='commentInlineWrapper__commentInline__footer'>
                    <div className='commentInlineWrapper__commentInline__footer__save' onClick={_saveComment}>
                        {tc.saveComment}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentNewInline;

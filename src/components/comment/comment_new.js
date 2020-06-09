import React, {useRef, useState} from 'react';
import {tc} from 'helpers';
import {saveComment} from 'store/comment/tasks';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

export default (props) => {
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
        if (props.close && typeof props.close === 'function') {
            props.close();
        }
    };

    return (
        <div className='commentWrapper'>
            <div className='commentWrapper__comment'>
                <div className='commentWrapper__comment__header'>
                    <WidgetHeader
                        iconVal='edit'
                        headline={tc.addComment}
                        headlineSub={props.headline ? props.headline : null}
                    />
                </div>
                <div className='commentWrapper__comment__content'>
                    <textarea onChange={_onChange} ref={commentNewTextRef} value={text}/>
                </div>
                <div className='commentWrapper__comment__footer'>
                    <WidgetFooter save={_saveComment}/>
                </div>
            </div>
        </div>
    );
};

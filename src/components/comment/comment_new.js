import React, {useRef, useState} from 'react';
import {tc} from 'helpers';
import {saveComment} from 'store/comment/tasks';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

const CommentNew = (props) => {
    const [text, setText] = useState('');
    const commentNewTextRef = useRef(null);

    const _onChange = () => {
        if (commentNewTextRef && commentNewTextRef.current && commentNewTextRef.current.value) {
            setText(commentNewTextRef.current.value);
        }
    };

    const _saveComment = async () => {
        props.close();
        if (commentNewTextRef && commentNewTextRef.current && commentNewTextRef.current.value) {
            await saveComment({comment: commentNewTextRef.current.value, target: props.target});
        }
    };

    return (
        <Popup close={props.close} size='small'>
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
                        <WidgetFooter buttonOneFunc={_saveComment} buttonOneText={tc.saveComment}/>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default CommentNew;

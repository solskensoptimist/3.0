import React, {useRef, useState} from 'react';
import {tc} from 'helpers';
import {saveComment} from 'store/comment/tasks';
import WidgetFooter from 'components/shared/widget_footer';
import WidgetHeader from 'components/shared/widget_header';

export default (props) => {
    const [text, setText] = useState('');
    const textRef = useRef(null);

    const _onChange = () => {
        if (textRef && textRef.current && textRef.current.value) {
            setText(textRef.current.value);
        }
    };

    const _saveComment = async () => {
        if (textRef && textRef.current && textRef.current.value) {
            await saveComment({comment: textRef.current.value, target: props.target});
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
                    />
                </div>
                <div className='commentWrapper__comment__content'>
                    <textarea onChange={_onChange} ref={textRef} value={text}/>
                </div>
                <div className='commentWrapper__comment__footer'>
                    <WidgetFooter save={_saveComment}/>
                </div>
            </div>
        </div>
    );
};

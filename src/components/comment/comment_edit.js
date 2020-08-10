import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {getComment, updateComment} from 'store/comment/tasks';
import Loading from 'components/loading';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

const CommentEdit = (state) => {
    const [text, setText] = useState('');
    const commentEditTextRef = useRef(null);

    useEffect( () => {
        const _getComment = async () => {
            await getComment({id: state.props.id});
            setText((state.comment.comment) ? state.comment.comment : '');
        };

        _getComment();
    }, [state.comment.comment, state.props.id]);

    const _onChange = () => {
        if (commentEditTextRef && commentEditTextRef.current && commentEditTextRef.current.value) {
            setText(commentEditTextRef.current.value);
        }
    };

    const _updateComment = async () => {
        state.props.close();
        if (commentEditTextRef && commentEditTextRef.current && commentEditTextRef.current.value) {
            await updateComment({comment: commentEditTextRef.current.value, id: state.props.id});
        }
    };

    const _stateCheck = () => {
        return !!(state && state.comment && state.comment.comment);
    };

    return ( _stateCheck() ?
        <Popup close={state.props.close} size='small'>
            <div className='commentWrapper'>
                <div className='commentWrapper__comment'>
                    <div className='commentWrapper__comment__header'>
                        <WidgetHeader
                            iconVal='edit'
                            headline={tc.editComment}
                            headlineSub={state.props.headline ? state.props.headline : null}
                        />
                    </div>
                    <div className='commentWrapper__comment__content'>
                        <textarea onChange={_onChange} ref={commentEditTextRef} value={text}/>
                    </div>
                    <div className='commentWrapper__comment__footer'>
                        <WidgetFooter save={_updateComment}/>
                    </div>
                </div>
            </div>
        </Popup> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        comment: state.comment,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(CommentEdit);

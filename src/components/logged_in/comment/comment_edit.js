import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {getComment} from 'store/comment/tasks';
import Loading from 'components/shared/loading';
import WidgetHeader from 'components/shared/widget_header';

const CommentEdit = (state) => {
    const _stateCheck = () => {
        return !!(state && state.comment && state.comment.comment);
    };

    useEffect(() => {
        getComment({id: state.props.id});
    }, []);

    return ( _stateCheck() ?
        <div className='commentWrapper'>
            <div className='commentWrapper__comment'>
                <div className='commentWrapper__comment__header'>
                    <WidgetHeader
                        iconVal='edit'
                        headline={tc.editComment}
                    />
                </div>
                <div className='commentWrapper__comment__content'>
                    Kommentarkomponent edit

                </div>
            </div>
        </div> :
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

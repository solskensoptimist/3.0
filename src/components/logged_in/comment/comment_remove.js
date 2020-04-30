import React from 'react';
import {tc} from 'helpers';
import {removeComment} from 'store/comment/tasks';
import WidgetFooter from 'components/shared/widget_footer';
import WidgetHeader from 'components/shared/widget_header';

export default (props) => {
    const _removeComment = async () => {
        await removeComment({id: props.id});
        if (props.close && typeof props.close === 'function') {
            props.close();
        }
    };

    return (
            <div className='commentWrapper'>
                <div className='commentWrapper__comment'>
                    <div className='commentWrapper__comment__header'>
                        <WidgetHeader
                            iconVal='remove'
                            headline={tc.removeComment}
                        />
                    </div>
                    <div className='commentWrapper__comment__content'>
                        {tc.removeEnsure}
                    </div>
                    <div className='commentWrapper__comment__footer'>
                        <WidgetFooter remove={_removeComment}/>
                    </div>
                </div>
            </div>
    );
};

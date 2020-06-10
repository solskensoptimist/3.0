import React from 'react';
import {tc} from 'helpers';
import {removeComment} from 'store/comment/tasks';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

export default (props) => {
    const _removeComment = async () => {
        props.close();
        await removeComment({id: props.id});
    };

    return (
        <Popup close={props.close} size='small'>
            <div className='commentWrapper'>
                <div className='commentWrapper__comment'>
                    <div className='commentWrapper__comment__header'>
                        <WidgetHeader
                            iconVal='remove'
                            headline={tc.removeComment}
                            headlineSub={props.headline ? props.headline : null}
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
        </Popup>
    );
};

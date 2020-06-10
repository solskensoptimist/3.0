import React from 'react';
import {tc} from 'helpers';
import {completeEvent} from 'store/events/tasks';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

export default (props) => {
    const _completeEvent = async () => {
        props.close();
        await completeEvent({eventId: props.eventId});
    };

    return (
        <Popup close={props.close} size='small'>
            <div className='eventsFlowItemPopupWrapper'>
                <div className='eventsFlowItemPopupWrapper__eventsFlowItemPopup'>
                    <div className='eventsFlowItemPopupWrapper__eventsFlowItemPopup__header'>
                        <WidgetHeader
                            iconVal='remove'
                            headline={tc.completeEvent}
                        />
                    </div>
                    <div className='eventsFlowItemPopupWrapper__eventsFlowItemPopup__content'>
                        {tc.removeEnsure}
                    </div>
                    <div className='eventsFlowItemPopupWrapper__eventsFlowItemPopup__footer'>
                        <WidgetFooter save={_completeEvent}/>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

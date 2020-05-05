import React from 'react';
import {tc} from 'helpers';
import {completeEvent} from 'store/events/tasks';
import WidgetFooter from 'components/shared/widget_footer';
import WidgetHeader from 'components/shared/widget_header';

export default (props) => {
    const _completeEvent = async () => {
        await completeEvent({eventId: props.eventId});
        if (props.close && typeof props.close === 'function') {
            props.close();
        }
    };

    return (
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
    );
};

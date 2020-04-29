import React from 'react';
import {tc} from 'helpers';
import {removeEvent} from 'store/events/tasks';
import WidgetFooter from 'components/shared/widget_footer';
import WidgetHeader from 'components/shared/widget_header';

export default (props) => {
    const _removeEvent = async () => {
        await removeEvent({dealId: props.dealId, eventId: props.eventId});
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
                        headline={tc.removeEvent}
                    />
                </div>
                <div className='eventsFlowItemPopupWrapper__eventsFlowItemPopup__content'>
                    {tc.removeEnsure}
                </div>
                <div className='eventsFlowItemPopupWrapper__eventsFlowItemPopup__footer'>
                    <WidgetFooter remove={_removeEvent}/>
                </div>
            </div>
        </div>
    );
};

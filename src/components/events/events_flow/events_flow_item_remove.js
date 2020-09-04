import React from 'react';
import {tc} from 'helpers';
import {removeEvent} from 'store/events/tasks';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

export default (props) => {
    const _removeEvent = async () => {
        props.close();
        await removeEvent({dealId: props.dealId, eventId: props.eventId});
    };

    return (
        <Popup close={props.close} size='small'>
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
                        <WidgetFooter buttonOneFunc={_removeEvent} buttonOneText={tc.remove}/>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

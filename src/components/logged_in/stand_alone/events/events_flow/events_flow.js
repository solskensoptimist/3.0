import React, {useEffect, useState} from 'react';
import WidgetHeader from 'components/shared/widget_header';
import Icon from 'components/shared/icon';
import {tc} from "helpers";
import {connect} from "react-redux";
import EventsFlowItem from './events_flow_item';
import Loading from 'components/shared/loading';
import {getEvents} from "store/events/tasks";
import Tooltip from 'components/shared/tooltip';

const EventsFlow = (state) => {
    const amountIncrease = 5;
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _renderEvents = () => {
        let data = state.events.events;

        // Show 5 more rows every time user click load icon.
        data = data.slice(0, showAmount);

        data = data.map((num, i) => {
            return <EventsFlowItem/>;
        });

        return (data.length) ? data : <p>{tc.noEvents}</p>;
    };

    const _stateCheck = () => {
        return (state.events && state.events.events);
    };

    useEffect(() => {
        getEvents();
    }, []);

    return ( _stateCheck() ?
        <div className='eventsFlowWrapper'>
            <div className='eventsFlowWrapper__eventsFlow'>
                <div className='eventsFlowWrapper__eventsFlow__header'>
                    <WidgetHeader
                        iconVal='events'
                        dashboard={
                            <>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.eventsCalendar}><Icon val='eventsCalendar' onClick={() => {state.props.setView('calendar')}}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.eventsFlow}><Icon val='eventsFlow' onClick={() => {state.props.setView('flow')}}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                {minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            </>
                        }
                        headline={tc.events}
                        headlineSub={tc.activitiesComingUp}
                    />
                </div>
                <div className={minimize ? 'hide' : 'eventsFlowWrapper__eventsFlow__content'}>
                    {_renderEvents()}
                </div>
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        events: state.events,
        props: props,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(EventsFlow);


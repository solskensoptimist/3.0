import React, {useEffect, useState} from 'react';
import {tc} from "helpers";
import {connect} from "react-redux";
import {getEventsFlow} from "store/events/tasks";
import EventsFlowItem from './events_flow_item';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';
import moment from "moment";

const EventsFlow = (state) => {
    const amountIncrease = 5;
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _renderEvents = () => {
        let data = state.events;

        // Show more rows every time user click load icon.
        data = data.slice(0, showAmount);

        data = data.map((num, i) => {
            return (
                <React.Fragment key={i}>
                    {_renderEventItem(num)}
                </React.Fragment>);
        });

        return (data.length) ? data : <p>{tc.noEvents}</p>;
    };

    const _renderEventItem = (event) => {
        if (!event.action || event.action === '') {
            return null;
        }
        console.log('event', event);
        // Action:
        // Om dealId eller prospectId har värde, så ska vi inte visa details.
        // Om vi visar details ska vi länka till affären/prospektet. Ska hela raden vara länk, eller en liten länk?


        // Comment
        const comment = (event.comment) ? event.comment : null;

        // Date
        const date = (event.event_date) ? moment(event.event_date).format('LL HH:mm') : null;

        // Icon
        const icon = <Icon val={event.action}/>;

        // User
        const user = (event.user && event.user !== '') ? event.user : tc.unknown;

        return <EventsFlowItem comment={comment} date={date} icon={icon} user={user}/>;
    };

    const _stateCheck = () => {
        return !!state.events;
    };

    useEffect(() => {
        getEventsFlow({
            dealId: (state.props && state.props.dealId) ? state.props.dealId : null,
            prospectId: (state.props && state.props.prospectId) ? state.props.prospectId : null,
        });
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
                                <Tooltip horizontalDirection='left' tooltipContent={tc.eventsFlow}><Icon active={true} val='eventsFlow' onClick={() => {state.props.setView('flow')}}/></Tooltip>
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
        events: state.events.eventsFlow,
        props: props,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(EventsFlow);


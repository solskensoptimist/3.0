import React, {useEffect, useState} from 'react';
import {activityHelper, tc} from 'helpers';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {getEvents} from "store/events/tasks";
import EventsFlowItem from './events_flow_item';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

const EventsFlow = (state) => {
    const amountIncrease = 5;
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [eventRows, setEventRows] = useState(null); // Holds JSX content.
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _stateCheck = () => {
        return !!state.events;
    };

    useEffect(() => {
        getEvents({
            target: (state.props && state.props.target) ? state.props.target : null,
            type: state.props.type,
        });
    }, [state.props]);

    useEffect(() => {
        const _renderEvents = () => {
            let data = state.events;

            // If no data, minimize widget.
            if (!data || (data && data.length === 0)) {
                setEventRows(<p>{tc.noEvents}</p>);
                return setMinimize(true);
            } else {
                setMinimize(false);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            data = data.slice(0, showAmount);

            setEventRows(data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderEventItem(num)}
                    </React.Fragment>);
            }));
        };

        const _renderEventItem = (event) => {
            if (!event.action || event.action === '') {
                return null;
            }

            // Action
            let action;
            if (state.props.target && state.props.target === event.dealId) {
                // Showing events for specific target, no link needed.
                action = <div>{activityHelper.getReadableActivity(event.action)}</div>;
            } else {
                // Add a link to action description.
                action = <div>{activityHelper.getReadableActivity(event.action)} {activityHelper.getPreposition(event.action).toLowerCase()} <NavLink exact to={'/affar/' + event.dealId} key='affar'>{(event.name) ? event.name : tc.noName}</NavLink></div>
            }

            // Comment
            const comment = (event.comment) ? event.comment : null;

            // Date
            const date = (event.event_date) ? event.event_date : null;

            // Deal id
            const dealId = event.dealId;

            // Event id
            const eventId = event._id;

            // Icon
            const icon = <Icon val={event.action}/>;

            // User
            const user = (event.user && event.user !== '') ? event.user : tc.unknown;

            return <EventsFlowItem action={action} comment={comment} date={date} dealId={dealId} eventId={eventId} icon={icon} isEditable={(state.user.info.id === event.user_id)} user={user}/>;
        };

        _renderEvents();
    }, [showAmount, state.events, state.props.target, state.user]);

    return ( _stateCheck() ?
        <div className={(state.props.small) ? 'eventsFlowWrapper small' : 'eventsFlowWrapper'}>
            <div className='eventsFlowWrapper__eventsFlow'>
                <div className='eventsFlowWrapper__eventsFlow__header'>
                    <WidgetHeader
                        iconVal='events'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.eventsCalendar}><Icon val='eventsCalendar' onClick={() => {state.props.setView('calendar')}}/></Tooltip>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.eventsFlow}><Icon active={true} val='eventsFlow' onClick={() => {state.props.setView('flow')}}/></Tooltip>
                                    {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                    {(showAmount < dataLength) && <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={tc.events}
                        headlineSub={tc.activitiesComingUp}
                    />
                </div>
                {!minimize &&
                    <div className='eventsFlowWrapper__eventsFlow__content'>
                        {eventRows}
                    </div>
                }
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        events: state.events.events,
        props: props,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(EventsFlow);


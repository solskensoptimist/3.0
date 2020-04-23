import React, {useEffect, useState} from 'react';
import ContentHeader from 'components/shared/content_header';
import Icon from 'components/shared/icon';
import {tc} from "helpers";
import {connect} from "react-redux";
import EventsFlowItem from './events_flow_item';
import Loading from 'components/shared/loading';
import {getEvents} from "store/events/tasks";

const EventsFlow = (state) => {
    const [showAmount, setShowAmount] = useState(5);
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
                    <ContentHeader
                        iconVal='events'
                        dashboard={
                            <>
                                <Icon hover={true} val='eventsCalendar' onClick={() => {state.props.setView('calendar')}}/>
                                <Icon hover={true} val='eventsFlow' onClick={() => {state.props.setView('flow')}}/>
                                <Icon hover={true} val='load' onClick={() => {setShowAmount(showAmount + 10)}}/>
                                <Icon hover={true} val='regret' onClick={() => {setShowAmount(5)}}/>
                                {minimize ? <Icon hover={true} val='maximize' onClick={() => {setMinimize(false)}}/> : <Icon hover={true} val='minimize' onClick={() => {setMinimize(true)}}/>}
                            </>
                        }
                        headline={tc.events}
                        headlineSub={tc.plannedActivitiesNotPerformed}
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


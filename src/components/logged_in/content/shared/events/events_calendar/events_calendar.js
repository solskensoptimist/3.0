import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import {connect} from "react-redux";
import EventsCalendarDay from './events_calendar_day';
import Loading from 'components/shared/loading';
import {getEvents} from 'store/events/tasks';
import moment from 'moment';
import Icon from 'components/shared/icon';
import ContentHeader from 'components/shared/content_header';

const EventsCalendar = (state) => {
    const [minimize, setMinimize] = useState(false);

    const _renderDays = () => {
        const days = [];

        for (const day in state.events.month) {
            const hasPassed = moment(new Date()).format('YYYY-MM-DD') > moment(new Date(day)).format('YYYY-MM-DD');
            const isToday = moment(new Date(day)).isSame(new Date(), 'day');
            days.push(<EventsCalendarDay date={state.events.month[day].date} events={state.events.month[day].events} hasPassed={hasPassed} isToday={isToday} key={day} />);
        }

        return days;
    };

    const _stateCheck = () => {
        return (state.events && state.events.month);
    };

    const _stepBack = () => {
        getEvents({
            date: {
                month: (state.events.monthInScope === 1) ? 12 : state.events.monthInScope - 1,
                year: (state.events.monthInScope === 1) ? state.events.yearInScope - 1 : state.events.yearInScope,
            }
        })
    };

    const _stepForward = () => {
        getEvents({
            date: {
                month: (state.events.monthInScope === 12) ? 1 : state.events.monthInScope + 1,
                year: (state.events.monthInScope === 12) ? state.events.yearInScope + 1 : state.events.yearInScope,
            }
        })
    };

    useEffect(() => {
        getEvents();
    }, []);

    return ( _stateCheck() ?
        <div className='eventsCalendarWrapper'>
            <div className='eventsCalendarWrapper__eventsCalendar'>
                <div className='eventsCalendarWrapper__eventsCalendar__header'>
                    <ContentHeader
                        dashboard={
                            <>
                                <Icon hover={true} val='eventsCalendar' onClick={() => {state.props.setView('calendar')}}/>
                                <Icon hover={true} val='eventsFlow' onClick={() => {state.props.setView('flow')}}/>
                                <Icon hover={true} val='navigateBefore' onClick={_stepBack}/>
                                <Icon hover={true} val='navigateNext' onClick={_stepForward}/>
                                {minimize ? <Icon hover={true} val='maximize' onClick={() => {setMinimize(false)}}/> : <Icon hover={true} val='minimize' onClick={() => {setMinimize(true)}}/>}
                            </>
                        }
                        iconVal='events'
                        headline={tc.events}
                        headlineSub={'' + tc.calendarMonths[state.events.monthInScope] + ' ' + state.events.yearInScope}/>
                </div>
                <div className={minimize ? 'hide' : 'eventsCalendarWrapper__eventsCalendar__content'}>
                    {_renderDays()}
                </div>
            </div>
        </div> :
            <Loading />
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
)(EventsCalendar);

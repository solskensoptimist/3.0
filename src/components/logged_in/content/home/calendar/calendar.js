import React, {useEffect} from 'react';
import tc from 'text_content';
import {connect} from "react-redux";
import Day from './subcomponents/day';
import Loading from 'components/common/loading';
import {getEvents} from 'store/events/tasks';
import moment from 'moment';

const Calendar = (state) => {
    useEffect(() => {
        getEvents();
    }, []);

    const _renderDays = () => {
        const result = [];
        for (const day in state.events.month) {
            const hasPassed = moment(new Date()).format('YYYY-MM-DD') > moment(new Date(day)).format('YYYY-MM-DD');
            const isToday = moment(new Date(day)).isSame(new Date(), 'day');
            result.push(<Day key={day} date={state.events.month[day].date} events={state.events.month[day].events} hasPassed={hasPassed} isToday={isToday} />);
        }
        return result;
    };

    const _stateCheck = () => {
        return (state.events && state.events.month);
    };

    return ( _stateCheck() ?
        <div className='calendarWrapper'>
            <div className='headlineMain'>
                <h3>{tc.plannedActivities}</h3>
                <h5>Mars</h5>
            </div>
            <div className='calendar'>
            {_renderDays()}
            </div>
        </div> :
            <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        events: state.events,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Calendar);

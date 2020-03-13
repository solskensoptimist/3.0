import React, {useEffect} from 'react';
import tc from 'text_content';
import {connect} from "react-redux";
import {getEvents} from 'store/events/tasks';
import Day from './subcomponents/day';
import Loading from 'components/common/loading';

const Calendar = (state) => {
    useEffect(() => {
        getEvents();
    }, []);

    const stateCheck = () => {
        return (state && state.events && state.events.month);
    };

    const renderDays = () => {
        const result = [];
        for (const day in state.events.month) {
            result.push(<Day day={day} events={state.events.month[day]} />);
        }
        return result;
    };

    return ( stateCheck() ?
        <div className='calendarWrapper'>
            {tc.calendar}
            {renderDays()}
        </div> :
            <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        events: state.events,
    };
};

export default connect(
    MapStateToProps,
)(Calendar);

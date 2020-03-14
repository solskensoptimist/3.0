import React from 'react';

export default (props) => {
    const classname = (props.events && props.events.length) ? 'dayWrapper hasEvent' : 'dayWrapper';
    const event = (props.events && props.events.length) ? props.events.map((num) => {
        return (
            <div key={num._id} className='day__content__event'>
                <p className='event'>{num.name}<i className='fas fa-chevron-right' /></p>
            </div>)
        ;
    }) : null;
    console.log('props', props);
    // {/*{props.day}*/}
    // {/*Antal events: {props.events.length}*/}
    return (
        <div className={classname}>
            <div className='day'>
                <div className='day__date'>
                    18
                </div>
                <div className='day__content'>
                    <div className='day__content__dateInformation'>
                        <p className='weekday'>Onsdag</p>
                        <p className='week'>Vecka 12</p>
                    </div>
                    {event}
                </div>
            </div>
        </div>
    );
}

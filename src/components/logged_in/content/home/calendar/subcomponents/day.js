import React from 'react';
import activityHelper from 'shared_helpers/activity_helper';
import {NavLink} from 'react-router-dom';


export default (props) => {
    const classname = (props.events && props.events.length) ? 'dayWrapper hasEvent' : 'dayWrapper';
    const event = (props.events && props.events.length) ? props.events.map((num) => {
        const icon = activityHelper.getIconsByActivity(num.action);
        const event = activityHelper.getReadableActivity(num.action);
        const fillerText = (icon === 'fa-phone' || icon === 'fa-envelope' || icon === 'fa-pencil') ? 'till' : 'med';
        return (
            <div key={num._id} className='day__content__event'>
                <NavLink to={'/affar/' + num.dealId} key='affar'>
                    <div className='day__content__event__icon'>
                        <i className={'fa ' + icon} />
                    </div>
                    <div key={num._id} className='day__content__event__info'>
                        <p><span className='highlight'>{event}</span> {fillerText} {num.name}</p>
                        <i className='fas fa-chevron-right' />
                    </div>
                </NavLink>
            </div>)
        ;
    }) : null;

    return (
        <div className={classname}>
            <div className='day'>
                <div className='day__date'>
                    {props.date.date}
                </div>
                <div className='day__content'>
                    <div className='day__content__dateInformation'>
                        <p className='weekday'>{props.date.weekday}</p>
                        <p className='week'>Vecka {props.date.week}</p>
                    </div>
                    {event}
                </div>
            </div>
        </div>
    );
}

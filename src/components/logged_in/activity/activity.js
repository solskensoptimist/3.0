import React, {useEffect} from 'react';
import {getActivityByFilter} from 'store/activity/tasks';
import Activities from 'components/logged_in/activities';
import Events from 'components/logged_in/events';

export default () => {
    useEffect(() => {
        getActivityByFilter();
    });

    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                <div className='activityWrapper__activity__header'>
                    I header ska vi ha en undermeny med filter
                </div>
                <div className='activityWrapper__activity__content'>
                    <div className='activityWrapper__activity__content__item'>
                        <Events type='flow' />
                    </div>
                    <div className='activityWrapper__activity__content__item'>
                        <Activities includeMoved={true} type='filter' />
                    </div>
                </div>
            </div>
        </div>
    );
}

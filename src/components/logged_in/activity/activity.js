import React, {useEffect} from 'react';
import {getActivityByFilter} from 'store/activity/tasks';
import Activities from 'components/logged_in/activities';

export default () => {
    useEffect(() => {
        getActivityByFilter();
    });

    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                <div className='activityWrapper__activity__header'>

                </div>
                <div className='activityWrapper__activity__content'>
                    <div className='activityWrapper__activity__content__item'>
                        <Activities type='filter' />
                    </div>
                </div>
            </div>
        </div>
    );
}

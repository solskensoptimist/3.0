import React, {useEffect} from 'react';
import {getActivity} from 'store/activity/tasks';
import Activities from 'components/activities';
import Events from 'components/events';
import Menu from 'components/menu';

export default () => {
    useEffect(() => {
        getActivity({type: 'filter'});
    });

    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                <div className='activityWrapper__activity__header'>
                    <Menu items={[
                        {
                            label: 'Menyval 1',
                            onClick: () => {},
                            type: 'button',
                        },
                        {
                            label: 'Menyval 2',
                            onClick: () => {},
                            type: 'button',
                        }
                    ]}
                    />
                </div>
                <div className='activityWrapper__activity__content'>
                    <div className='activityWrapper__activity__content__item'>
                        <Events type='filter' view='flow' />
                    </div>
                    <div className='activityWrapper__activity__content__item'>
                        <Activities includeMoved={true} type='filter' />
                    </div>
                </div>
            </div>
        </div>
    );
}

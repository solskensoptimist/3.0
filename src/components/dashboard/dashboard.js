import React from 'react';
import Events from 'components/events';
import News from 'components/news';

export default () => {
    return (
        <div className='dashboardWrapper'>
            <div className='dashboardWrapper__dashboard'>
                <div className='dashboardWrapper__dashboard__content'>
                    <div className='dashboardWrapper__dashboard__content__item'>
                        <News />
                    </div>
                    <div className='dashboardWrapper__dashboard__content__item'>
                        <Events small={true} type='all' view='calendar' />
                    </div>
                </div>
            </div>
        </div>
    );
}

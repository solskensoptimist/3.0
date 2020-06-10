import React from 'react';
import Events from 'components/events';
import News from 'components/news';

export default () => {
    return (
        <div className='homeWrapper'>
            <div className='homeWrapper__home'>
                <div className='homeWrapper__home__content'>
                    <div className='homeWrapper__home__content__item'>
                        <News />
                    </div>
                    <div className='homeWrapper__home__content__item'>
                        <Events small={true} type='all' view='calendar' />
                    </div>
                </div>
            </div>
        </div>
    );
}

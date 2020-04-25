import React from 'react';
import Events from 'components/logged_in/stand_alone/events';
import News from 'components/logged_in/stand_alone/news';

export default () => {
    return (
        <div className='homeWrapper'>
            <News />
            <Events view='calendar' />
        </div>
    );
}

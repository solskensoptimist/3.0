import React from 'react';

export default (props) => {
    console.log('props', props);
    return(
        <div className='dayWrapper'>
            {props.day}
            Antal events: {props.events.length}
        </div>
    );
}

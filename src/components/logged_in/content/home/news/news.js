import React from 'react';
import tc from 'text_content';

export default () => {
    return (
        <div className='newsWrapper'>
            <div className='headlineMain'>
                <h3>{tc.news}</h3>
            </div>
         </div>
    );
}

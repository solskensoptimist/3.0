import React from 'react';
import {tc} from 'helpers';

export default () => {
    return (
        <div className='footerContactWrapper'>
            <div className='footerContactWrapper__footer__contact'>
                <h4>{tc.contact}</h4>
                <p>{tc.contactInfo}</p>
            </div>
        </div>
    );
}

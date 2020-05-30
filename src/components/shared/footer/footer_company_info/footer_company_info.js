import React from 'react';
import {tc} from 'helpers';

export default () => {
    return (
        <div className='footerCompanyInfoWrapper'>
            <div className='footerCompanyInfoWrapper__footerCompanyInfo'>
                <h4>{tc.aboutUs}</h4>
                <p>{tc.companyInfo}</p>
            </div>
        </div>
    );
}

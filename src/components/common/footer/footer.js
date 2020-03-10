import React from 'react';
import Breadcrumbs from './breadcrumbs';
import CompanyInfo from './company_info';
import Contact from './contact';

/**
 * Footer component.
 */
export default () => {
    return (
        <div className='footer'>
            <div className='footer__breadcrumbsWrapper'>
                <Breadcrumbs />
            </div>
            <div className='footer__contactWrapper'>
                <Contact />
            </div>
            <div className='footer__companyInfoWrapper'>
                <CompanyInfo />
            </div>
        </div>
    );
};

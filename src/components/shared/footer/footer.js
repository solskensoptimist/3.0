import React  from 'react';
import Breadcrumbs from './breadcrumbs';
import FooterCompanyInfo from './footer_company_info';
import FooterContact from './footer_contact';

/**
 * Footer component.
 */
export default () => {
    return (
        <div className='footer'>
            <div className='footer__item footer__breadcrumbsWrapper'>
                <Breadcrumbs />
            </div>
            <div className='footer__item footer__footerCompanyInfoWrapper'>
                <FooterCompanyInfo />
            </div>
            <div className='footer__item footer__footerContactWrapper'>
                <FooterContact />
            </div>
        </div>
    );
}

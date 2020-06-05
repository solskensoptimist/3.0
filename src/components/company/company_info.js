import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {NavLink} from 'react-router-dom';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

const CompanyInfo = (state) => {
    const [emails, setEmails] = useState([]);
    const [minimize, setMinimize] = useState(false);
    const [phoneNumbers, setPhoneNumbers] = useState([]);

    const _stateCheck = () => {
        return (emails && phoneNumbers && state && state.company && state.company.company && Object.keys(state.company.company).length);
    };

    useEffect(() => {
        if (state.company && state.company.company) {
            setEmails(state.company.company.emails);
            setPhoneNumbers(state.company.company.phoneNumbers);
        }
    }, [state.company]);

    return ( _stateCheck() ?
        <div className='companyInfoWrapper'>
            <div className='companyInfoWrapper__companyInfo'>
                <div className='companyInfoWrapper__companyInfo__header'>
                    <WidgetHeader
                        iconVal='company'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={tc.info}
                        headlineSub={tc.companyInfo}
                    />
                </div>
                {!minimize &&
                <div className='companyInfoWrapper__companyInfo__content'>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.companyName}</p>
                        <p>{(state.company.company.name) ? state.company.company.name : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.orgNr}</p>
                        <p>{(state.company.company.user_id) ? state.company.company.user_id : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.branch}</p>
                        <p>{(state.company.company.finance && state.company.company.finance.abv_hgrupp) ? state.company.company.finance.abv_hgrupp : tc.dataMissing}</p>
                            <p>{(state.company.company.finance && state.company.company.finance.abv_ugrupp) ? state.company.company.finance.abv_ugrupp : null}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.koncernCompany}</p>
                        <p>{(state.company.koncern && state.company.koncern.mother) ?
                            <>{tc.partOfKoncern} {tc.with.toLowerCase()} {state.company.koncern.count.toString()} {tc.companies.toLowerCase()} {tc.and.toLowerCase()} {state.company.koncern.cars.toString()} {tc.cars.toLowerCase()}: <NavLink exact to={'/koncern/' + state.company.koncern.mother.id} key='hem'>{state.company.koncern.mother.name}</NavLink></>
                            : tc.dataMissing}
                        </p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.visitingAddress}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ba_gatuadress) ? state.company.company.addresses.ba_gatuadress : tc.dataMissing}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ba_postnr && state.company.company.addresses.ba_postort) ? '' + state.company.company.addresses.ba_postnr + ' ' + state.company.company.addresses.ba_postort : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.postAddress}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ua_gatuadress) ? state.company.company.addresses.ua_gatuadress : tc.dataMissing}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ua_postnr && state.company.company.addresses.ua_postort) ? '' + state.company.company.addresses.ua_postnr + ' ' + state.company.company.addresses.ua_postort : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.phoneNumbers}</p>
                        <p>{(phoneNumbers && phoneNumbers.length) ? phoneNumbers.map((num) => <p>{num.value}</p>) : null}</p>
                        <p>Lägg till telefon</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoLabel'>{tc.email}</p>
                        <p>{(emails && emails.length) ? emails.map((num) => <p>{num.value}</p>) : null}</p>
                        <p>Lägg till e-post. Man ska även kunna redigera varje epost och telefon</p>
                    </div>
                </div>
                }
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        company: state.company,
    };
};

export default connect(
    MapStateToProps,
)(CompanyInfo);

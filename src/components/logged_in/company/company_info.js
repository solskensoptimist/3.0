import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

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
                    Company Info
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

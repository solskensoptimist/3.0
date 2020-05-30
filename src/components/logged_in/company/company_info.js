import React, {useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

const CompanyInfo = (state) => {
    const [minimize, setMinimize] = useState(false);

    return (
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
        </div>
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

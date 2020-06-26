import React, {useState} from 'react';
import {connect} from 'react-redux';
import {tc} from "helpers";
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

const KoncernInformation = (state) => {
    const [minimize, setMinimize] = useState(false);


    const _stateCheck = () => {
        return (state.company && state.company.company && Object.keys(state.company.company).length);
    };

    return (_stateCheck() ?
        <div className='companyInfoWrapper'>
            <div className='companyInfoWrapper__companyInfo'>
                <div className='companyInfoWrapper__companyInfo__header'>
                    <WidgetHeader
                        iconVal='koncern'
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
                        headlineSub={tc.aboutKoncern}
                    />
                </div>
                {!minimize &&
                    <div className='companyInfoWrapper__companyInfo__content'>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.company}</p>
                            <p>{(state.company.company.name) ? state.company.company.name : tc.dataMissing}</p>
                            <p>{(state.company.company.user_id) ? state.company.company.user_id : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.visitingAddress}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.addresses && state.company.koncern.info.finance.addresses.ba_gatuadress && state.company.koncern.info.finance.addresses.ba_gatuadress.length) ? state.company.koncern.info.finance.addresses.ba_gatuadress[0] : tc.dataMissing}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.addresses && state.company.koncern.info.finance.addresses.ba_postnr && state.company.koncern.info.finance.addresses.ba_postnr.length) ? state.company.koncern.info.finance.addresses.ba_postnr[0] : tc.dataMissing}&nbsp;
                                {(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.addresses && state.company.koncern.info.finance.addresses.ba_postort && state.company.koncern.info.finance.addresses.ba_postort.length) ? state.company.koncern.info.finance.addresses.ba_postort[0] : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.postAddress}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.addresses && state.company.koncern.info.finance.addresses.ua_gatuadress && state.company.koncern.info.finance.addresses.ua_gatuadress.length) ? state.company.koncern.info.finance.addresses.ua_gatuadress[0] : tc.dataMissing}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.addresses && state.company.koncern.info.finance.addresses.ua_postnr && state.company.koncern.info.finance.addresses.ua_postnr.length) ? state.company.koncern.info.finance.addresses.ua_postnr[0] : tc.dataMissing}&nbsp;
                                {(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.addresses && state.company.koncern.info.finance.addresses.ua_postort && state.company.koncern.info.finance.addresses.ua_postort.length) ? state.company.koncern.info.finance.addresses.ua_postort[0] : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.netSales}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.finance && state.company.koncern.info.finance.finance.netoms_AB_X) ? state.company.koncern.info.finance.finance.netoms_AB_X : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.cashLiquidity}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.finance && state.company.koncern.info.finance.finance.kasslikvid_NT_AB_X) ? state.company.koncern.info.finance.finance.kasslikvid_NT_AB_X + '%' : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.solidity}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.finance && state.company.koncern.info.finance.finance.solid_NT_AB_X) ? state.company.koncern.info.finance.finance.solid_NT_AB_X + '%' : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.resefinintokost}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.finance && state.company.koncern.info.finance.finance.resefinintokost_AB_X) ? state.company.koncern.info.finance.finance.resefinintokost_AB_X : tc.dataMissing}</p>
                        </div>
                        <div className='companyInfoWrapper__companyInfo__content__item'>
                            <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.noEmployees}</p>
                            <p>{(state.company.koncern && state.company.koncern.info && state.company.koncern.info.finance && state.company.koncern.info.finance.finance && state.company.koncern.info.finance.finance.antanst_AB_X) ? state.company.koncern.info.finance.finance.antanst_AB_X + ' ' + tc.aPiece.toLowerCase() : tc.dataMissing}</p>
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
)(KoncernInformation);

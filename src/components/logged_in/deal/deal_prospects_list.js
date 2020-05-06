import React, {useState} from 'react';
import {connect} from 'react-redux';
import {tc} from "helpers";
import {NavLink} from 'react-router-dom';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * This component renders a pretty basic list, based on deal.prospectsInfo.
 */
const DealProspectsList = (state) => {
    const amountIncrease = 4;
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _renderProspectsList = () => {
        let data = state.deal.prospectInfo;

        // Show more rows every time user click load icon.
        data = data.slice(0, showAmount);

        if (data.length) {
            return data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderProspectsListItem(num)}
                    </React.Fragment>
                );
            });
        } else {
            return <p>{tc.noProspects}</p>;
        }
    };

    const _renderProspectsListItem = (prospect) => {
        return (
            <div className='dealProspectsListsWrapper__dealProspectsLists__content__item'>
                <NavLink exact to={(prospect.type === 'company') ? '/foretag/' + prospect.id : '/person/' + prospect.id} key={prospect.id}>
                    <div className='dealProspectsListsWrapper__dealProspectsLists__content__item__infoHolder'>
                        <div className='dealProspectsListsWrapper__dealProspectsLists__content__item__infoHolder__icon'>{(prospect.type === 'company') ? <Icon val='company'/> : <Icon val='person'/>}</div>
                        <div className='dealProspectsListsWrapper__dealProspectsLists__content__item__infoHolder__info'>
                            <div className='dealProspectsListsWrapper__dealProspectsLists__content__item__infoHolder__info__name'>{prospect.name}</div>
                            <div className='dealProspectsListsWrapper__dealProspectsLists__content__item__infoHolder__info__address'>{prospect.zipMuncipality}</div>
                        </div>
                    </div>
                    <div className='dealProspectsListsWrapper__dealProspectsLists__content__item__linkHolder'>
                        <Icon val='link'/>
                    </div>
                </NavLink>
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(state && state.deal && state.deal.prospectInfo);
    };

    return ( _stateCheck() ?
        <div className='dealProspectsListsWrapper'>
            <div className='dealProspectsListsWrapper__dealProspectsLists'>
                <div className='dealProspectsListsWrapper__dealProspectsLists__header'>
                    <WidgetHeader
                        iconVal='person'
                        dashboard={
                            <>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                {minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            </>
                        }
                        headline={tc.prospects}
                        headlineSub={tc.dealProspectsInfo}
                    />
                </div>
                <div className={minimize ? 'hide' : 'dealProspectsListsWrapper__dealProspectsLists__content'}>
                    {_renderProspectsList()}
                </div>
            </div>
        </div> :
        <Loading/>
    );
};


const MapStateToProps = (state) => {
    return {
        deal: state.deal,
    };
};

export default connect(
    MapStateToProps,
)(DealProspectsList);
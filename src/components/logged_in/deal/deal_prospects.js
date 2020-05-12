import React, {useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {NavLink} from 'react-router-dom';
import {updateDeal} from 'store/deal/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * This component renders a list of prospects, based on store.deal.prospectsInfo.
 */
const DealProspects = (state) => {
    const amountIncrease = 6;
    const [showAddProspect, setShowAddProspect] = useState(false);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _addProspects = async () => {
        const ids = state.search.selectedAll.map((num) => num.id.toString());
        return await updateDeal({prospectsToAdd: ids});
    };

    const _removeProspect = async (id) => {
        return await updateDeal({prospectsToRemove: [id.toString()]});
    };

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
            return <p className='marginTop'>{tc.noProspects}</p>;
        }
    };

    const _renderProspectsListItem = (prospect) => {
        return (
            <div className='dealProspectsWrapper__dealProspects__content__prospects__item'>
                <div className='dealProspectsWrapper__dealProspects__content__prospects__item__icon'>
                    <div className='dealProspectsWrapper__dealProspects__content__prospects__item__icon__visible'>{(prospect.type === 'company') ? <Icon val='company'/> : <Icon val='person'/>}</div>
                    <div className='dealProspectsWrapper__dealProspects__content__prospects__item__icon__hidden'><Tooltip horizontalDirection='left' tooltipContent={tc.removeProspect}><Icon val='remove' onClick={async () => {return await _removeProspect(prospect.id)}}/></Tooltip></div>
                </div>
                <NavLink exact to={(prospect.type === 'company') ? '/foretag/' + prospect.id : '/person/' + prospect.id} key={prospect.id}>
                    <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder'>
                        <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder__info'>
                            <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder__info__name'>{prospect.name}</div>
                            <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder__info__address'>{prospect.zipMuncipality}</div>
                        </div>
                    </div>
                    <div className='dealProspectsWrapper__dealProspects__content__prospects__item__linkHolder'>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToProspect}><Icon val='navigate'/></Tooltip>
                    </div>
                </NavLink>
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(state && state.deal && state.deal.prospectInfo);
    };

    return ( _stateCheck() ?
        <div className='dealProspectsWrapper'>
            <div className='dealProspectsWrapper__dealProspects'>
                <div className='dealProspectsWrapper__dealProspects__header'>
                    <WidgetHeader
                        iconVal='person'
                        dashboard={
                            <>
                                {showAddProspect ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.hideConnectProspects}><Icon val='linkOff' onClick={() => {setShowAddProspect(false)}}/></Tooltip> :
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.connectProspects}><Icon val='link' onClick={() => {setShowAddProspect(true)}}/></Tooltip>
                                }
                                <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                {minimize ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> :
                                    <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                }
                            </>
                        }
                        headline={tc.prospects}
                        headlineSub={tc.dealProspectsInfo}
                    />
                </div>
                {!minimize &&
                    <div className='dealProspectsWrapper__dealProspects__content'>
                        {showAddProspect &&
                        <div className='dealProspectsWrapper__dealProspects__content__search'>
                            <Search type='all' save={_addProspects}/>
                        </div>
                        }
                        <div className='dealProspectsWrapper__dealProspects__content__prospects'>
                            {_renderProspectsList()}
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
        deal: state.deal,
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(DealProspects);

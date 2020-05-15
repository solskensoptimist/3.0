import React, {useEffect, useState} from 'react';
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
    const amountIncrease = 4;
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [prospectRows, setProspectRows] = useState(null); // Holds JSX content.
    const [showAddProspect, setShowAddProspect] = useState(true);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(true);

    const _addProspects = async () => {
        const ids = state.search.selectedAll.map((num) => num.id.toString());
        return await updateDeal({prospectsToAdd: ids});
    };

    const _removeProspect = async (id) => {
        return await updateDeal({prospectsToRemove: [id.toString()]});
    };

    const _stateCheck = () => {
        return !!(state && state.deal && state.deal.prospectInfo);
    };

    useEffect(() => {
        /**
         * Render prospect rows, and set to state.
         */
        const _renderProspects = () => {
            let data = state.deal.prospectInfo;

            // if no data, minimize widget.
            if (data.length === 0) {
                setProspectRows(<p className='marginTop'>{tc.noProspects}</p>);
                return setMinimize(true);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            data = data.slice(0, showAmount);

            setProspectRows(data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderProspectItem(num, (i === 0))}
                    </React.Fragment>
                );
            }));
        };

        /**
         * Return a prospect row.
         */
        const _renderProspectItem = (prospect, firstItem) => {
            return (
                <div className='dealProspectsWrapper__dealProspects__content__prospects__item'>
                    <div className='dealProspectsWrapper__dealProspects__content__prospects__item__icon'>
                        <div className='dealProspectsWrapper__dealProspects__content__prospects__item__icon__visible'>{(prospect.type === 'company') ? <Icon val='company'/> : <Icon val='person'/>}</div>
                        <div className='dealProspectsWrapper__dealProspects__content__prospects__item__icon__hidden'><Tooltip horizontalDirection='right' verticalDirection={firstItem ? 'bottom' : 'top'} tooltipContent={tc.removeProspect}><Icon val='remove' onClick={async () => {return await _removeProspect(prospect.id)}}/></Tooltip></div>
                    </div>
                    <NavLink exact to={(prospect.type === 'company') ? '/foretag/' + prospect.id : '/person/' + prospect.id} key={prospect.id}>
                        <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder'>
                            <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder__info'>
                                <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder__info__name'>{prospect.name}</div>
                                <div className='dealProspectsWrapper__dealProspects__content__prospects__item__infoHolder__info__address'>{prospect.zipMuncipality}</div>
                            </div>
                        </div>
                        <div className='dealProspectsWrapper__dealProspects__content__prospects__item__linkHolder'>
                            <Tooltip horizontalDirection='left' verticalDirection={firstItem ? 'bottom' : 'top'}  tooltipContent={tc.navigateToProspect}><Icon val='navigate'/></Tooltip>
                        </div>
                    </NavLink>
                </div>
            );
        };

        if (state.deal && state.deal.prospectInfo) {
            _renderProspects();
        }
    }, [showAmount, state.deal]);

    return ( _stateCheck() ?
        <div className='dealProspectsWrapper'>
            <div className='dealProspectsWrapper__dealProspects'>
                <div className='dealProspectsWrapper__dealProspects__header'>
                    <WidgetHeader
                        iconVal='person'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={showAddProspect ? tc.hideConnectProspects : tc.connectProspects}><Icon active={showAddProspect} val='link' onClick={() => {setShowAddProspect(!showAddProspect)}}/></Tooltip>
                                    {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                    {(showAmount < dataLength) && <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={tc.prospects}
                        headlineSub={tc.handleProspects}
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
                            {prospectRows}
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

import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getDeal} from 'store/deal/tasks';
import Activities from 'components/logged_in/content/stand_alone/activities';
import Events from 'components/logged_in/content/stand_alone/events';
import Loading from 'components/shared/loading';
import {dealHelper, tc} from 'helpers';
import Icon from 'components/shared/icon';
import moment from 'moment';
import Tooltip from "../../../shared/tooltip/tooltip";

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const {id} = useParams();

    const _addComment = () => {
        console.log('addComment');
    };

    const _editDeal = () => {
        console.log('editDeal');
    };

    const _stateCheck = () => {
        return (state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    useEffect(() => {
        getDeal({id: id});
    }, [id]);

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='dealWrapper__deal'>
                <div className='dealWrapper__deal__header'>
                    <div className='dealWrapper__deal__header__top'>
                        <h3>{state.deal.deal.name}</h3>
                    </div>
                    <div className='dealWrapper__deal__header__bottom'>
                        <div className='dealWrapper__deal__header__bottom__left'>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.status}</h4>
                                <p>{dealHelper.getReadablePhase(state.deal.deal.phase)}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.savedInList}</h4>
                                <p>{state.deal.listOrigin}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.responsible}</h4>
                                <p>{state.deal.deal.userName}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.created}</h4>
                                <p>{moment(state.deal.deal.created).format('YYYY-MM-DD HH:mm')}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.lastUpdate}</h4>
                                <p>{moment(state.deal.deal.updated).fromNow()}</p>
                            </div>
                        </div>
                        <div className='dealWrapper__deal__header__bottom__right'>
                            <div className='dealWrapper__deal__header__bottom__right__item'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.comment}><Icon val='comment' onClick={_addComment}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.edit}><Icon val='edit' onClick={_editDeal}/></Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dealWrapper__deal__content'>
                    <div className='dealWrapper__deal__content__item'>
                        <Events view='flow'/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <Activities id={id} includeComments={true} includeMoved={true} type='target' />
                    </div>
                </div>
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        deal: state.deal,
    };
};

export default connect(
    MapStateToProps,
)(Deal);

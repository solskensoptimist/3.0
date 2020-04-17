import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getActivityByTarget} from 'store/activity/tasks';
import {getDeal} from 'store/deal/tasks';
import ActivityStream from 'components/logged_in/content/shared/activity_stream';
import Loading from 'components/shared/loading';
import {dealHelper, tc} from 'helpers';
import moment from 'moment';

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const {id} = useParams();

    const _stateCheck = () => {
        return (state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    useEffect(() => {
        getDeal({id: id});
        getActivityByTarget({id: id, type: 'deal'});
    }, [id]);

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='dealWrapper__deal'>
                <div className='dealWrapper__deal__header'>
                    <div className='dealWrapper__deal__header__top'>
                        <h3>Kvinna, 28, LINKÖPING</h3>
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
                                <p>{moment(state.deal.deal.updated).format('YYYY-MM-DD HH:mm')}</p>
                            </div>
                        </div>
                        <div className='dealWrapper__deal__header__bottom__right'>
                            <div className='dealWrapper__deal__header__bottom__right__item'>
                                <i className='fas fa-pencil-alt' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dealWrapper__deal__content'>
                    <div className='dealWrapper__deal__content__item'>
                        <div className='dealWrapper__deal__content__item__left'>
                            <i className='far fa-calendar-alt' />
                        </div>
                        <div className='dealWrapper__deal__content__item__right'>
                            <div className='dealWrapper__deal__content__item__right__title'>
                                <h2>{tc.plannedActivities}</h2>
                                <h3>{tc.plannedActivitiesNotPerformed}</h3>
                            </div>
                            Här kommer det visas en ström av planerade aktiviter, likt den som idag visas när man går in på en affär.
                        </div>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <div className='dealWrapper__deal__content__item__left'>
                            <i className='fas fa-history' />
                        </div>
                        <div className='dealWrapper__deal__content__item__right'>
                            <div className='dealWrapper__deal__content__item__right__title'>
                                <h2>{tc.activities}</h2>
                                <h3>{tc.activitiesAllIncludingComments}</h3>
                            </div>
                            <ActivityStream type='target' />
                        </div>
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

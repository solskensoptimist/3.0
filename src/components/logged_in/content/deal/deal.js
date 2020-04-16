import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getActivityByTarget} from 'store/activity/tasks';
import {getDeal} from 'store/deal/tasks';
import ActivityStream from 'components/logged_in/content/shared/activity_stream';
import Loading from 'components/shared/loading';
import {tc} from 'helpers';

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const {id} = useParams();

    const _stateCheck = () => {
        return (state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    /*

     _buildStreamData(data) {
        let builtData = [];

        _.each(data, (deal) => {
            // Activities planned
            if (deal.events && deal.events.length > 0) {
                _.each(deal.events, (event) => {
                    builtData.push({
                        icon: 'fa-clock-o',
                        label: deal.userName + this._buildActivityMetaString('planerat', event.action),
                        comment: event.comment,
                        date: event.date_created,
                    });
                });
            }

            // Activities marked as complete
            if (deal.actions !== undefined && deal.actions.length > 0) {
                _.each(deal.actions, (action) => {
                    builtData.push({
                        icon: 'fa-check',
                        label: deal.userName + this._buildActivityMetaString('utfört', action.action),
                        comment: null,
                        date: action.date_created,
                    });
                });
            }
        });

        // Moves

        return builtData
    },
     */

    useEffect(() => {
        getDeal({id: id});
        getActivityByTarget({id: id, type: 'deal'});
    }, [id]);

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='dealWrapper__deal'>
                <div className='dealWrapper__deal__header'>
                    <div className='dealWrapper__deal__header__top'>
                        <h3>Man, 28, LINKÖPING</h3>
                    </div>
                    <div className='dealWrapper__deal__header__bottom'>
                        <div className='dealWrapper__deal__header__bottom__left'>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.status}</h4>
                                <p>Statusen</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.savedInList}</h4>
                                <p>Listnamnet</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.responsible}</h4>
                                <p>Affärsägare</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.created}</h4>
                                <p>När skapad</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.lastUpdate}</h4>
                                <p>Senast uppdaterad</p>
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
                            En planerade aktiviteter komponent.
                            Göra om events_calender i week view att bara visa de dagar som har events?
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
                            <p>Id: {id}</p>
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

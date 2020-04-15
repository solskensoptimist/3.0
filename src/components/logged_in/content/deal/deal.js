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
        getActivityByTarget({id: id}); // For ActivityStream
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
                        </div>
                        <div className='dealWrapper__deal__header__bottom__right'>
                            <div className='dealWrapper__deal__header__bottom__right__item'>
                                <i className='fas fa-pencil-alt' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dealWrapper__deal__content'>
                    Deal komponent
                    <p>Id: {id}</p>
                    <p>Fixa så att vi visar namn om vi har, annars Man 82, LINKÖPING</p>
                    <p>Vi kommer behöva göra ett anrop till... se activity_stream_component. Vi behöver hämta både events och allt i deal_actions.</p>
                    <p>Här passar det nog att komma så nära activity_stream_component logik som möjligt.</p>
                    <p>Men kan vi göra anropet när vi hämtar en deal, fast i bakgrunden? Inte nödvändigtvis när denna komponent laddas.</p>
                    <ActivityStream type='target' />
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

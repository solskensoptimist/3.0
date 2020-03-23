import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getDeal} from 'store/deal/tasks';
import Loading from 'components/common/loading';

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const {id} = useParams();

    useEffect(() => {
        getDeal({id: id});
    }, [id]);

    const _stateCheck = () => {
        return (state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    /*
    1. Varför får vi inte köpt namn någonstans? Får ju detta i 2.0...
    2. Rendera upp kommentarer/events i blandad stream (som på nuvarande deal-sida),
    såhär görs i 2.0

    FÖRST:
    dispatcher.dispatch(AgileConstants.AGILE_NEW_DEAL); // Reset deal
        var dealState = DealStore.getState();
        return {
            deals: dealState.prospectDeals,
            tabIndex: 0,
        };
    },

    SEDAN:

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

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='deal'>
                Deal komponent
                <p>Id: {id}</p>
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

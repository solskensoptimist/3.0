import React from 'react';
import {connect} from 'react-redux';
import Loading from 'components/shared/loading';
import {activityHelper, tc} from 'helpers';

const ActivityStream = (state) => {

    const _renderActivity = () => {
        // Oavsett om det är filter eller target bör vi rendera likadant..?
        // Kom ihåg att denna komponent bara ska rendera innehåll, inga bakgrundsfärger/färger eller så.
        return (<div>
            Här kommer det visas en aktivitetsström, dvs allt som har skett på affären.
        </div>);
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

    const _stateCheck = () => {
        if (state.props.type === 'filter') {
            return !!state && state.activity && state.activity.activityByFilter; // Utveckla...
        } else if (state.props.type === 'target') {
            return !!state && state.activity && state.activity.activityByTarget && state.activity.activityByTarget.data;
        }
    };

    return ( _stateCheck() ?
        <div className='activityStreamWrapper'>
            <div className='activityStreamWrapper_activityStream'>
                {_renderActivity()}
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state, props) => {
    return {
        activity: state.activity,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(ActivityStream);


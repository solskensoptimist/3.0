import React from 'react';
import {connect} from 'react-redux';
import Loading from 'components/shared/loading';
import {activityHelper, dealHelper, tc} from 'helpers';
import moment from 'moment';
import Icon from 'components/shared/icon';


const Activities = (state) => {
    const _renderActivity = () => {
        let data = (state.props.type === 'filter') ? state.activity.activityByFilter : state.activity.activityByTarget;

        if (!state.props.includeMoved) {
            // Remove 'move' activites.
            data = data.filter((num) => ((num.action && num.action !== 'move') || !num.action));
        }

        if (!state.props.includeComments) {
            // Remove 'comment' activites (comment activities have no action).
            data = data.filter((num) => (num.action));
        }


        return data.map((num, i) => {
            // Action
            let action = (num.action) ? activityHelper.getReadableActivity(num.action): null;
            if (num.action === 'move') {
                action = <div>{activityHelper.getReadableActivity(num.action)} {tc.theDeal.toLowerCase()} {tc.from.toLowerCase()} <strong>{dealHelper.getReadablePhase(num.phase)}</strong> {tc.to.toLowerCase()} <strong>{dealHelper.getReadablePhase(num.target)}</strong></div>
            } else if (!num.action && num.comment && num.comment !== '') {
                action = activityHelper.getReadableActivity('comment');
            }

            // Comment
            const comment = (num.comment && num.comment !== '') ? num.comment : null;

            // Date
            const date = (num.date_created) ? moment(num.date_created).format('LL HH:mm') : null;

            // Icon
            let icon;
            if (num.action) {
                icon = <Icon val={num.action}/>;
            } else if (!num.action && num.comment) {
                icon = <Icon val='comment'/>;
            }

            // User
            const user = (num.user && num.user !== '') ? num.user : tc.unknown;

            return (
                <div className='activitiesWrapper__activities__itemWrapper' key={i}>
                    <div className='activitiesWrapper__activities__itemWrapper__item'>
                        <div className='activitiesWrapper__activities__itemWrapper__item__icon'><span className='iconHolder'>{icon}</span></div>
                        <div className='activitiesWrapper__activities__itemWrapper__item__date'><span className='label'>{tc.time}:</span>{date}</div>
                        <div className='activitiesWrapper__activities__itemWrapper__item__action'><span className='label'>{tc.action}:</span>{action}</div>
                        <div className='activitiesWrapper__activities__itemWrapper__item__comment'><span className='label'>{tc.comment}:</span>{comment}
                        asdnö adna södlna sdklsa dlökanslaknsdlask ndsöalkns la
                        asdnö adna södlna sdklsa dlökanslaknsdlask ndsöalkns la
                        asdnö adna södlna sdklsa dlökanslaknsdlask ndsöalkns la
                        asdnö adna södlna sdklsa dlökanslaknsdlask ndsöalkns la
                        </div>
                        <div className='activitiesWrapper__activities__itemWrapper__item__user'><span className='label'>{tc.user}:</span>{user}</div>
                        <div className='activitiesWrapper__activities__itemWrapper__item__edit'><span className='iconHolder'><Icon val='edit'/><Icon val='remove'/></span></div>
                    </div>
                </div>
            );
        });

        // return state./
        // Oavsett om det är filter eller target bör vi rendera likadant..?
        // Kom ihåg att denna komponent bara ska rendera innehåll, inga bakgrundsfärger/färger eller så.
        // return (<div>
        //     Här kommer det visas en aktivitetsström, dvs allt som har skett på affären.
        //     KOM IHÅG ATT MAN SKA KUNNA SKAPA/REDIGERA/TA BORT KOMMENTARER.
        //     Ha en lösning för att visa några och sedan "visa allt".
        // </div>);
    };

    const _stateCheck = () => {
        if (state.props.type === 'filter') {
            return !!state && state.activity && state.activity.activityByFilter;
        } else if (state.props.type === 'target') {
            return !!state && state.activity && state.activity.activityByTarget;
        }
    };

    return ( _stateCheck() ?
        <div className='activitiesWrapper'>
            <div className='activitiesWrapper__activities'>
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
)(Activities);


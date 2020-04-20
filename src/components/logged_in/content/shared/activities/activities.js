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


        return data.map((num) => {
            // Action
            let action = (num.action) ? <div className='activitiesWrapper__activities__item__action'>{activityHelper.getReadableActivity(num.action)}</div> : null;
            if (num.action === 'move') {
                action =
                    <div className='activitiesWrapper__activities__item__action'>
                        {activityHelper.getReadableActivity(num.action)} {tc.theDeal} {tc.from} <strong>{dealHelper.getReadablePhase(num.phase)}</strong> {tc.to} <strong>{dealHelper.getReadablePhase(num.target)}</strong>
                    </div>;
            }

            // Comment
            const comment = (num.comment && num.comment !== '') ? <div className='activitiesWrapper__activities__item__comment'>{num.comment}</div> : null;

            // Date
            const date = (num.date_created) ? <div className='activitiesWrapper__activities__item__date'>{moment(num.date_created).format('HH:mm LL')}</div> : null;

            // Icon
            let icon;
            if (num.action) {
                icon =
                    <div className='activitiesWrapper__activities__item__icon'>
                        <Icon val={num.action}/>
                    </div>
            } else if (!num.action && num.comment) {
                icon =
                    <div className='activitiesWrapper__activities__item__icon'>
                    <Icon val='comment'/>
                </div>
            }

            // User


            return (
                <div className='activitiesWrapper__activities__item'>
                    {comment}
                    {date}
                    {action}
                    {icon}
                </div>);
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


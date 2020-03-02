import React from 'react';
import {connect} from 'react-redux';
// import {groupsActionTypes} from 'store/groups/actions';
import {GroupsSub} from './subcomponents/groups_sub';

const Groups = () => {
    // SKa byggas om obv... när ska vi hämta grupper? componentDidUpdate, eller när en användare loggar in?
    const getGroups = () => {
        this.props.getGroups('dealer');
    };

    return (
        <div onClick={getGroups}>
            <div>
                Groups huvud-komponent
            </div>
            <GroupsSub />
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        groups: state.groups,
    };
};

export default connect(
    MapStateToProps,
)(Groups);

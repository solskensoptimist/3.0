import React from 'react';
import {connect} from 'react-redux';
import {GroupsSub} from './subcomponents/groups_sub';

const Groups = () => {
    return (
        <div>
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

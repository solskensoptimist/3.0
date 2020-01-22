import React from 'react';
import {connect} from 'react-redux';
import {groupsActionTypes} from 'store/groups/actions';
import {GroupsSubComponent} from './subcomponents/groups_sub_component';

class GroupsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.getGroups = this.getGroups.bind(this);
    }

    // SKa byggas om obv... när ska vi hämta grupper? componentDidUpdate, eller när en användare loggar in?
    getGroups() {
        this.props.getGroups('dealer');
    }

    render() {
        return (
            <div onClick={this.getGroups}>
                <div>
                    Groups huvud-komponent
                </div>
                <GroupsSubComponent />
            </div>
        );
    }
}

const MapStateToProps = (state) => {
    return {
        groups: state.groups,
    };
};

export default connect(
    MapStateToProps,
)(GroupsComponent);

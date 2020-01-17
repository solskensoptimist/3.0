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
    return state.groups;
};

const MapDispatchToProps = (dispatch) => {
    return {
        getGroups: (type) => { dispatch({ type: groupsActionTypes.GET_GROUPS, payload: type }) },
    };

};

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(GroupsComponent);

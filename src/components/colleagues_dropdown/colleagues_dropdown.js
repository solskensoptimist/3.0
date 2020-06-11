import React from 'react';
import {connect} from 'react-redux';
import {Dropdown, DropdownItem, DropdownItemDelimiter} from 'components/dropdown';
import Loading from 'components/loading';

/**
 * Render a dropdown list of user colleagues. Can be used when setting owner of a deal, company etc.
 *
 * @param state.props.activeId - number - User id that is currently active.
 * @param state.props.activeName - string - Name that should be displayed at top.
 * @param state.props.highlight - bool (optional) - If we want top row highlighted, as when in edit mode.
 * @param state.props.onClick - func - When choosing a colleague, always sends back id and name as params.
 */
const ColleaguesDropdown = (state) => {

    const _stateCheck = () => {
        return !!(state && state.user);
    };

    const _renderColleagueList = () => {
        let colleagues = [];

        if (state.user.connections && state.user.connections.length) {
            // Render colleagues with dealer name delimiter, first the users own dealer...
            colleagues = [<DropdownItemDelimiter key={state.user.info.dealerName} label={state.user.info.dealerName}/>];
            colleagues = colleagues.concat(state.user.colleagues.map((user, i) => {
                return(
                    <DropdownItem
                        active={state.props.activeId === user.id}
                        key={user.id}
                        label={user.name}
                        onClick={() => {state.props.onClick(user.id, user.name)}}
                    />
                );
            }));

            // ...then the connections.
            colleagues = colleagues.concat(state.user.connections.map((dealer, i) => {
                const items = [];
                items.push(
                    <DropdownItemDelimiter key={dealer.name} label={dealer.name}/>
                );
                dealer.users.forEach((user) => {
                    items.push(
                        <DropdownItem
                            active={state.props.activeId === user.id}
                            key={user.id}
                            label={user.name}
                            onClick={() => {state.props.onClick(user.id, user.name)}}
                        />
                    );
                });
                return items;
            }));
        } else {
            colleagues = state.user.colleagues.map((user, i) => {
                // Render colleagues without delimiter.
                return (
                    <DropdownItem
                        active={state.props.activeId === user.id}
                        key={user.id}
                        label={user.name}
                        onClick={() => {state.props.onClick(user.id, user.name)}}
                    />
                );
            })
        }

        return (
            <Dropdown displayValue={state.props.activeName} highlight={state.props.highlight}>
                {colleagues}
            </Dropdown>
        );
    };

    return (_stateCheck() ?
        _renderColleagueList() :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        props: props,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(ColleaguesDropdown);

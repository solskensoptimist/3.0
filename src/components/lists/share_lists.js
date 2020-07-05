import React, {useState} from 'react';
import {tc} from 'helpers';
import {connect} from 'react-redux';
import Icon from 'components/icon';
import Loading from 'components/loading';
import WidgetHeader from 'components/widget_header';
import WidgetFooter from 'components/widget_footer';

/**
 * Component that helps user to split a list.
 * If a user manually adjusts the value for rows, we automatically calculate average value for the other rows.
 *
 * @param state.props.lists - array - The lists to share.
 * @param state.props.save - func - Here we return the user ids to share lists with.
 */
const ShareLists = (state) => {
    const [users, setUsers] = useState([]);

    const _renderUsers = () => {
        let colleagues = [];
        if (state.user.colleagues && state.user.colleagues.length) {
            colleagues.push(
                <div className='shareListsWrapper__shareLists__content__users__dealer' key={state.user.info.dealer_id}>
                    {state.user.info.dealerName}
                </div>
            );
            state.user.colleagues.forEach((num) => {
                if (num.id !== state.user.info.id) {
                    colleagues.push(
                        <div className='shareListsWrapper__shareLists__content__users__user' key={num.id}>
                            <Icon active={users.find((x) => x.id === num.id)} val={users.find((x) => x.id === num.id) ? 'check' : 'checkbox'} onClick={() => {
                                if (users.find((x) => x.id === num.id)) {
                                    setUsers(users.filter((x) => x.id !== num.id));
                                } else {
                                    setUsers(users.concat([num]))
                                }
                            }}/>
                            {num.name}
                        </div>
                    );
                }
            });
        }

        let connections = [];
        if (state.user.connections && state.user.connections.length) {
            state.user.connections.forEach((dealer) => {
                connections.push(
                    <div className='shareListsWrapper__shareLists__content__users__dealer' key={dealer.id}>
                        {dealer.name}
                    </div>
                );
                dealer.users.forEach((num) => {
                    connections.push(
                        <div className='shareListsWrapper__shareLists__content__users__user' key={num.id}>
                            <Icon active={users.find((x) => x.id === num.id)} val={users.find((x) => x.id === num.id) ? 'check' : 'checkbox'} onClick={() => {
                                if (users.find((x) => x.id === num.id)) {
                                    setUsers(users.filter((x) => x.id !== num.id));
                                } else {
                                    setUsers(users.concat([num]))
                                }
                            }}/>
                            {num.name}
                        </div>
                    );
                });
            });
        }

        return colleagues.concat(connections)
    };

    const _stateCheck = () => {
        return !!(state.user && state.user.colleagues && state.props.lists);
    };

    return (_stateCheck() ?
        <div className='shareListsWrapper'>
            <div className='shareListsWrapper__shareLists'>
                <div className='shareListsWrapper__shareLists__header'>
                    <WidgetHeader
                        iconVal='share'
                        headline={(state.props.lists.length > 1) ? tc.shareLists : tc.shareList}
                    />
                </div>
                <div className='shareListsWrapper__shareLists__content'>
                    <div className='shareListsWrapper__shareLists__content__lists'>
                        <div className='shareListsWrapper__shareLists__content__lists__label'>{tc.lists}:</div>
                        <div className='shareListsWrapper__shareLists__content__lists__lists'>
                            {state.props.lists.map((list, i) => {
                                if (i === state.props.lists.length - 1) {
                                    return <p key={i}>{list.name}</p>;
                                } else {
                                    return <p key={i}>{list.name}<span className='bullet'>&#8226;</span></p>;
                                }
                            })}
                        </div>
                    </div>
                    {users.length ?
                        <div className='shareListsWrapper__shareLists__content__selectedUsers'>
                            <div className='shareListsWrapper__shareLists__content__selectedUsers__label'>{tc.shareWith}:</div>
                            <div className='shareListsWrapper__shareLists__content__selectedUsers__users'>
                                {users.map((num, i) => {
                                    if (i === users.length - 1) {
                                        return <p key={i}>{num.name}</p>;
                                    } else {
                                        return <p key={i}>{num.name}<span className='bullet'>&#8226;</span></p>;
                                    }
                                })}
                            </div>
                        </div> : null
                    }
                    <div className='shareListsWrapper__shareLists__content__users'>
                        {_renderUsers()}
                    </div>
                </div>
                <div className='shareListsWrapper__shareLists__footer'>
                    <WidgetFooter save={() => {
                        if (users.length && typeof state.props.save === 'function') {
                            return state.props.save(users.map((num) => num.id));
                        }
                    }}
                    />
                </div>
            </div>
        </div> :
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
)(ShareLists);

import React from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import Loading from 'components/loading';
import Menu from 'components/menu';

const List = (state) => {
    const {id} = useParams();

    const _minKnapp = () => {
        console.log('Min knapp klickades');
    };

    const _mittDropdownItem = () => {
        console.log('Mitt dropdownitem klickades');
    };

    const _stateCheck = () => {
        return true;
    };

    return ( _stateCheck() ?
            <div className='listsWrapper'>
                <div className='listsWrapper__lists'>
                    <div className='listsWrapper__lists__header'>
                        <Menu items={[
                            {label: 'Min knapp', onClick:_minKnapp, type: 'button'},
                            {label: 'Min dropdown', type: 'dropdown', items: [
                                    {label: 'Dropdownitem 1', onClick: _mittDropdownItem},
                                    {label: 'Dropdownitem 2', onClick: _mittDropdownItem},
                                    {label: 'Dropdownitem 3', onClick: _mittDropdownItem},
                                ]}
                        ]}
                        />
                    </div>
                    <div className='listsWrapper__lists__content'>
                        List id: {id}
                    </div>
                </div> :
            </div> :
            <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        lists: state.lists,
    };
};

export default connect(
    MapStateToProps,
)(List);

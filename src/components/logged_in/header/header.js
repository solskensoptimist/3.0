import React  from 'react';
import Logotype from 'components/common/logotype';
import Navigation from './navigation';
import Search from "./search";
import User from './user';
import {connect} from 'react-redux';
import {setShowSearch} from 'store/search/tasks';

const Header = (state) => {
    const _setShowSearch = () => {
        setShowSearch({showSearch: !state.search.showSearch});
    };

    return (
        <div className='headerWrapper'>
            <Logotype />
            <div className='headerWrapper__header'>
                <div className='headerWrapper__header__top'>
                    <div className='headerWrapper__header__top__left' onClick={_setShowSearch}>
                        <i className="fas fa-search" />
                        {state.search.showSearch && <div className='searchWrapper' onClick={_setShowSearch}><Search /></div>}
                    </div>
                    <div className='headerWrapper__header__top__right'>
                        <User />
                    </div>
                </div>
                <Navigation />
            </div>
        </div>
    );
}

const MapStateToProps = (state) => {
    return {
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(Header);

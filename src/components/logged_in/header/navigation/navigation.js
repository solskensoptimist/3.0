import React  from 'react';
import {NavLink} from "react-router-dom";
import {iconHelper, tc} from 'helpers';
import {setShowSearch} from 'store/search/tasks';
import SearchComponent from './search/';
import {connect} from 'react-redux';

/**
 * Navigation_logged_in component.
 */
const Navigation = (state) =>  {
    const _openShowSearch = () => {
        setShowSearch({showSearch: true});
    };

    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <NavLink exact to={'/'} key='hem'>
                        {iconHelper.getIcon('home')}
                        {tc.home}
                    </NavLink>
                    <NavLink exact to={'/aktivitet'} key='aktivitet'>
                        {iconHelper.getIcon('activity')}
                        {tc.activity}
                    </NavLink>
                    <NavLink exact to={'/analysera'} key='analysera'>
                        {iconHelper.getIcon('analyze')}
                        {tc.analyse}
                    </NavLink>
                    <NavLink exact to={'/bearbeta'} key='bearbeta'>
                        {iconHelper.getIcon('agile')}
                        {tc.agile}
                    </NavLink>
                    <NavLink exact to={'/listor'} key='listor'>
                        {iconHelper.getIcon('lists')}
                        {tc.lists}
                    </NavLink>
                    <NavLink exact to={'/prospektera'} key='prospektera'>
                        {iconHelper.getIcon('prospect')}
                        {tc.prospect}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                    {state.search.showSearch && <SearchComponent />}
                    {iconHelper.getIconCircleWithOnClick('search', _openShowSearch)}
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(Navigation);


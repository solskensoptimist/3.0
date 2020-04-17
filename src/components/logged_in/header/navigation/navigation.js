import React  from 'react';
import {NavLink} from "react-router-dom";
import {tc} from 'helpers';
import {setShowSearch} from 'store/search/tasks';
import SearchComponent from './search/';
import {connect} from 'react-redux';
import {BarChart, Home, List, Sliders, Trello, TrendingUp} from 'react-feather';

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
                        {/*<i className='fas fa-home' />*/}
                        <Home />
                        {tc.home}
                    </NavLink>
                    <NavLink exact to={'/aktivitet'} key='aktivitet'>
                        <TrendingUp />
                        {tc.activity}
                    </NavLink>
                    <NavLink exact to={'/analysera'} key='analysera'>
                        {/*<i className='fas fa-chart-bar' />*/}
                        <BarChart />
                        {tc.analyse}
                    </NavLink>
                    <NavLink exact to={'/bearbeta'} key='bearbeta'>
                        {/*<i className='fas fa-columns' />*/}
                        <Trello />
                        {tc.agile}
                    </NavLink>
                    <NavLink exact to={'/listor'} key='listor'>
                        {/*<i className='fas fa-list' />*/}
                        <List />
                        {tc.lists}
                    </NavLink>
                    <NavLink exact to={'/prospektera'} key='prospektera'>
                        {/*<i className='fas fa-sliders-h' />*/}
                        <Sliders />
                        {tc.prospect}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                    {state.search.showSearch && <SearchComponent />}
                    <i className="fas fa-search" onClick={_openShowSearch} />
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


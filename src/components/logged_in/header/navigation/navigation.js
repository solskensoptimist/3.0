import React  from 'react';
import {NavLink} from "react-router-dom";
import {tc} from 'helpers';
import {setShowSearch} from 'store/search/tasks';
import SearchComponent from './search/';
import {connect} from 'react-redux';
import Icon from 'components/shared/icon';

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
                        <Icon val='home'/>
                        {tc.home}
                    </NavLink>
                    <NavLink exact to={'/aktivitet'} key='aktivitet'>
                        <Icon val='activity'/>
                        {tc.activity}
                    </NavLink>
                    <NavLink exact to={'/analysera'} key='analysera'>
                        <Icon val='analyze'/>
                        {tc.analyse}
                    </NavLink>
                    <NavLink exact to={'/bearbeta'} key='bearbeta'>
                        <Icon val='agile'/>
                        {tc.agile}
                    </NavLink>
                    <NavLink exact to={'/listor'} key='listor'>
                        <Icon val='lists'/>
                        {tc.lists}
                    </NavLink>
                    <NavLink exact to={'/prospektera'} key='prospektera'>
                        <Icon val='prospect'/>
                        {tc.prospect}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                    {state.search.showSearch && <SearchComponent />}
                    <Icon val='search' type='circle' onClick={_openShowSearch} />
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


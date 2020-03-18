import React from 'react';
import tc from 'text_content';
import Loading from 'components/common/loading';
import {connect} from 'react-redux';

const Search = (state) => {

    const _stateCheck = () => {
        return (state && state.search && state.search.showSettings);
    };

    return ( _stateCheck() ?
        <div className='searchWrapper'>
            <div className='search'>
                <div className='search__input'>
                    <input type='text' placeholder={tc.searchPlaceholder} />
                </div>
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(Search);



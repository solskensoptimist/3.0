import React from 'react';
import {connect} from 'react-redux';
// import {tc} from 'helpers';

const SearchSelect = (state) => {
    // let placeholder = tc.placeholderSearchAll;
    // if (state.props.type === 'carKoncern') {
    //     placeholder = tc.placeholderSearchCarKoncern;
    // } else if (state.props.type === 'contacts') {
    //     placeholder = tc.placeholderSearchContacts;
    // }

    return (
        <div className='searchSelectWrapper'>
            <div className='searchSelectWrapper__searchSelect'>
            </div>
        </div>
    );
};


const MapStateToProps = (state, props) => {
    return {
        props: props,
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(SearchSelect);

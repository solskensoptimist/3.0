import React from 'react';
import {connect} from 'react-redux';

const KoncernInformation = () => {
    return (
        <div className='koncernInformationWrapper'>
            <div className='koncernInformationWrapper__koncernInformation'>
                <div className='koncernInformationWrapper__koncernInformation__header'>
                    header
                </div>
                <div className='koncernInformationWrapper__koncernInformation__content'>
                    Koncern information
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        company: state.company,
    };
};

export default connect(
    MapStateToProps,
)(KoncernInformation);

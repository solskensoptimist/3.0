import React from 'react';
import {connect} from 'react-redux';

const KoncernStructure = () => {
    return (
        <div className='koncernStructureWrapper'>
            <div className='koncernStructureWrapper__koncernStructure'>
                <div className='koncernStructureWrapper__koncernStructure__header'>
                    header
                </div>
                <div className='koncernStructureWrapper__koncernStructure__content'>
                    Koncern struktur
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
)(KoncernStructure);

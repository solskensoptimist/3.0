import React  from 'react';
import {connect} from 'react-redux';
import {AgileSub} from './subcomponents/agile_sub';
import {tc} from 'helpers';

const Agile = (state) => {
    return (
        <div className='agileWrapper'>
            <div>
                {tc.agile}
            </div>
            <AgileSub />
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        groups: state.groups,
    };
};

export default connect(
    MapStateToProps,
)(Agile);

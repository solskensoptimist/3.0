import React  from 'react';
import {connect} from 'react-redux';
import {AgileSub} from './subcomponents/agile_sub';

const Agile = (state) => {
    return (
        <div className='agileWrapper'>
            <div>
                Bearbeta huvud-komponent
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

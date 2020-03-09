import React from 'react';
import {ProspectCar} from './subcomponents/prospect_car';
import {connect} from 'react-redux';

const Prospect = (state) =>  {
    return (
        <div>
            <div>
                Prospektera
            </div>
            <ProspectCar />
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        prospect: state.prospect,
    };
};

export default connect(
    MapStateToProps,
)(Prospect);

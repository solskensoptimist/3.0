import React from 'react';
import {ProspectCar} from './subcomponents/prospect_car';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom'
import {addRouteToHistory} from 'routing';

const Prospect = (state) =>  {
    return (
        <div className='prospectWrapper'>
            <div>
                Prospektera
            </div>
            <ProspectCar />
            <NavLink onClick={() => {addRouteToHistory('resultat')}} to='/prospektera/resultat' key='resultat'>Prospektera</NavLink>
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

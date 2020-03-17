import React  from 'react';
import {ProspectCar} from './subcomponents/prospect_car';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom'
import tc from 'text_content';

const Prospect = (state) =>  {
    return (
        <div className='prospectWrapper'>
            <div>
                {tc.prospect}
            </div>
            <ProspectCar />
            <NavLink to='/prospektera/resultat' key='resultat'>{tc.prospect}</NavLink>
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

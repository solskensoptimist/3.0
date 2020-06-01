import React from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';

/**
 * Render person view.
 */
const Person = (state) => {
    const {id} = useParams();

    return (
        <div className='personWrapper'>
            <p>Personkomponent</p>
            <p>Id: {id}</p>
            <p>Här ska vi bland annat visa alla deals som detta prospekt ingår i, inom dealer/colleagues/connections.</p>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        // person: state.person,
    };
};

export default connect(
    MapStateToProps,
)(Person);

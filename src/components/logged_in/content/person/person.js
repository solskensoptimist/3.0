import React from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';

/**
 * Render person view.
 */
const Person = (state) => {
    let {id} = useParams();

    // Hämta id ovan, använd useEffect att anropa store för att hämta allt på personen.

    return (
        <div className='personWrapper'>
            Person komponent
            <p>Id: {id}</p>
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

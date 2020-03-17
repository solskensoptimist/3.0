import React from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';

const Deal = (state) => {
    let {id} = useParams();

    // Hämta id ovan, använd useEffect att anropa store för att hämta deal.

    return (
        <div className='personWrapper'>
            Deal komponent
            <p>Id: {id}</p>
        </div>
    );
};


const MapStateToProps = (state) => {
    return {
        // deal: state.deal,
    };
};

export default connect(
    MapStateToProps,
)(Deal);

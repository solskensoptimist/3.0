import React from 'react';
import {ProspectCar} from './subcomponents/prospect_car';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';

// Data grid
// let rows = [];
// for (let i = 0; i < 100; i++) {
//     rows.push({
//         row: i,
//         activity: 'Sälja bil',
//         user: 'Kvinna, 46, DEGERFORS',
//         noOfCars: 15,
//         noOfMatchingCars: 11,
//         matchingCars: 'SKODA, PICK-UP 1, VOLVO 940 och 8 till'
//     });
// }
// const gridOptions = {
//     columnDefs: [
//         {field: 'row', headerName: 'Rad',},
//         {field: 'activity', headerName: 'Aktivitet2',},
//         {field: 'user', headerName: 'Brukare'},
//         {field: 'noOfCars', headerName: 'Antal fordon',},
//         {field: 'noOfMatchingCars', headerName: 'Antal matchande fordon'},
//         {field: 'matchingCars', headerName: 'Matchande fordon'},
//     ],
//     rowData: rows
// };

const Prospect = (state) =>  {
    console.log('state i prospektera', state);
    // const name = state.user.data.name ? <p>Inloggad som: {state.user.data.name}</p> : null;
    return (
        <div>
            <div>
                <RouterLink to='/prospektera/resultat'>Gör prospektering</RouterLink>
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

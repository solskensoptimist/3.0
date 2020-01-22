import React from 'react';
import {ProspectCarComponent} from './subcomponents/prospect_car_component';
import {connect} from 'react-redux';
import BreadcrumbsComponent from 'components/breadcrumbs';
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

const ProspectComponent = (state) =>  {
    console.log('state i prospektera', state);
    // const name = state.user.data.name ? <p>Inloggad som: {state.user.data.name}</p> : null;
    return (
        <div>
            <BreadcrumbsComponent />
            <div>
                <RouterLink to='/prospektera/resultat'>Gör prospektering</RouterLink>
            </div>
            <ProspectCarComponent />
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        prospect: state.prospect,
        // Ange alltid den data vi behöver som property. Vi kommer behöva utöka detta. I.E. skicka ej in objekt som:
        // return state.prospect;
    };
};

export default connect(
    MapStateToProps,
)(ProspectComponent);

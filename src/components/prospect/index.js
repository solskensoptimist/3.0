import React from 'react';
import {ProspectSubComponent} from './subcomponents/prospect_sub_component';
import {connect} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import {BreadcrumbsComponent} from 'components/breadcrumbs';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link as RouterLink} from 'react-router-dom';

// ag-grid
let rows = [];
for (let i = 0; i < 100; i++) {
    rows.push({
        row: i,
        activity: 'Sälja bil',
        user: 'Kvinna, 46, DEGERFORS',
        noOfCars: 15,
        noOfMatchingCars: 11,
        matchingCars: 'SKODA, PICK-UP 1, VOLVO 940 och 8 till'
    });
}
const gridOptions = {
    columnDefs: [
        {field: 'row', headerName: 'Rad',},
        {field: 'activity', headerName: 'Aktivitet2',},
        {field: 'user', headerName: 'Brukare'},
        {field: 'noOfCars', headerName: 'Antal fordon',},
        {field: 'noOfMatchingCars', headerName: 'Antal matchande fordon'},
        {field: 'matchingCars', headerName: 'Matchande fordon'},
    ],
    rowData: rows
};

class ProspectComponent extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render () {
        return (
            <div>
                <BreadcrumbsComponent />
                <div>
                    <p>Text</p>
                    <RouterLink to='/prospektera/resultat'>Prospektera</RouterLink>
                </div>
                <div className="ag-theme-balham" style={ {height: '600px', width: '100%'} }>
                    <AgGridReact
                        columnDefs={gridOptions.columnDefs}
                        rowData={gridOptions.rowData}>
                    </AgGridReact>
                </div>
                <ProspectSubComponent />
            </div>
        );
    }
}

const MapStateToProps = (state) => {
    return {};
};

const MapDispatchToProps = (dispatch) => {
    return {};

};

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ProspectComponent);

import React, {useState} from 'react';
import {tc} from 'helpers';
import makeData from './make_data';
import Icon from 'components/icon';
import Table from 'components/table';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';


/**
 * Render a fleet table.
 *
 * @param props.fleet - Retrieve no data from store, get all vehicle data everything as props.
 * @param props.type - 'current' | 'historic'
 */
export default (props) => {
    const [minimize, setMinimize] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                columns: [
                    {
                        Header: 'First Name',
                        accessor: 'firstName',
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'lastName',
                    },
                ],
            },
            {
                Header: 'Info',
                columns: [
                    {
                        Header: 'Age',
                        accessor: 'age',
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits',
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                    },
                    {
                        Header: 'Profile Progress',
                        accessor: 'progress',
                    },
                ],
            },
        ],
        []
    );

    const data = React.useMemo(() => makeData(10, 3), [])

    return (
        <div className='fleetWrapper'>
            <div className='fleetWrapper__fleet'>
                <div className='fleetWrapper__fleet__header'>
                    <WidgetHeader
                        iconVal='car'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={(props.type === 'historic') ? tc.fleetHistoric : tc.fleet}
                        headlineSub='13 st fordon 0 dolda (se 2.0 för att bygga denna headline)'
                    />
                </div>
                {!minimize &&
                <div className='fleetWrapper__fleet__content'>
                    <Table columns={columns} data={data} />
                </div>
                }
            </div>
        </div>
    );
}

import React, {useState} from 'react';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * Render a fleet table.
 *
 * @param props.fleet - Retrieve no data from store, get all vehicle data everything as props.
 * @param props.type - 'current' | 'historic'
 */
export default (props) => {
    const [minimize, setMinimize] = useState(false);

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
                    Tar allting som props... ingen egen store för fleet.. det verkar dumt.
                </div>
                }
            </div>
        </div>
    );
}

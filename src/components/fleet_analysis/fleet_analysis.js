import React from 'react';
import {useParams} from 'react-router-dom';
import Fleet from 'components/fleet';
import FleetAnalysisCharts from './fleet_analysis_charts';

export default () => {
    const {id} = useParams();

    return (
        <div className='fleetAnalysisWrapper'>
            <div className='fleetAnalysisWrapper__fleetAnalysis'>
                <div className='fleetAnalysisWrapper__fleetAnalysis__header'>
                    header
                </div>
                <div className='fleetAnalysisWrapper__fleetAnalysis__content'>
                    <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                        <FleetAnalysisCharts prospectId={id}/>
                    </div>
                    <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                        <Fleet prospectId={id}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import Fleet from 'components/fleet';
import FleetAnalysisCharts from './fleet_analysis_charts';
import {tc} from "helpers";

export default () => {
    const {id} = useParams();
    const [showHistoric, setShowHistoric] = useState(false);

    return (
        <div className='fleetAnalysisWrapper'>
            <div className='fleetAnalysisWrapper__fleetAnalysis'>
                <div className='fleetAnalysisWrapper__fleetAnalysis__header'>
                    <div className='fleetAnalysisWrapper__fleetAnalysis__header__left'>
                        <h4>{tc.vehicleUser}</h4>
                        <h3>Namnet</h3>
                    </div>
                    <div className='fleetAnalysisWrapper__fleetAnalysis__header__right'>
                        <div className={showHistoric ?
                            'fleetAnalysisWrapper__fleetAnalysis__header__right__button' :
                            'fleetAnalysisWrapper__fleetAnalysis__header__right__button activeButton'}
                             onClick={() => {setShowHistoric(false)}}
                        >
                            {tc.fleetCurrent}
                        </div>
                        <div className={showHistoric ?
                            'fleetAnalysisWrapper__fleetAnalysis__header__right__button activeButton' :
                            'fleetAnalysisWrapper__fleetAnalysis__header__right__button'}
                             onClick={() => {setShowHistoric(true)}}
                        >
                            {tc.fleetHistoric}
                        </div>
                    </div>
                </div>
                <div className='fleetAnalysisWrapper__fleetAnalysis__content'>
                    {showHistoric ?
                        <>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <FleetAnalysisCharts historic={true} prospectId={id}/>
                            </div>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <Fleet historic={true} prospectId={id}/>
                            </div>
                        </> :
                        <>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <FleetAnalysisCharts prospectId={id}/>
                            </div>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <Fleet prospectId={id}/>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

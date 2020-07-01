import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {tc} from 'helpers';
import {getFleetAnalysis} from 'store/fleet_analysis/tasks';
import {connect} from 'react-redux';
import Fleet from 'components/fleet';
import FleetAnalysisCharts from './fleet_analysis_charts';
import Loading from 'components/loading';

const FleetAnalysis = (state) => {
    const {id} = useParams();
    const [showHistoric, setShowHistoric] = useState(false);

    const _stateCheck = () => {
        return !!(state.fleetAnalysis && state.fleetAnalysis.fleetAnalysis && state.fleetAnalysis.fleetAnalysisHistoric && Object.keys(state.fleetAnalysis.fleetAnalysis).length && Object.keys(state.fleetAnalysis.fleetAnalysisHistoric).length);
    };

    useEffect(() => {
        getFleetAnalysis({
            historic: false,
            prospectId: id
        });
        getFleetAnalysis({
            historic: true,
            prospectId: id
        });
    }, [id]);

    return (_stateCheck() ?
        <div className='fleetAnalysisWrapper'>
            <div className='fleetAnalysisWrapper__fleetAnalysis'>
                <div className='fleetAnalysisWrapper__fleetAnalysis__header'>
                    <div className='fleetAnalysisWrapper__fleetAnalysis__header__left'>
                        <h4>{tc.vehicleUser}</h4>
                        <h3>{state.fleetAnalysis.fleetAnalysis.target.name}</h3>
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
                                <FleetAnalysisCharts data={state.fleetAnalysis.fleetAnalysisHistoric} historic={true}/>
                            </div>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <Fleet historic={true} prospectId={id}/>
                            </div>
                        </> :
                        <>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <FleetAnalysisCharts data={state.fleetAnalysis.fleetAnalysis}/>
                            </div>
                            <div className='fleetAnalysisWrapper__fleetAnalysis__content__item'>
                                <Fleet prospectId={id}/>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        fleetAnalysis: state.fleetAnalysis,
    };
};

export default connect(
    MapStateToProps,
)(FleetAnalysis);

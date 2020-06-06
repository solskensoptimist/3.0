import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {NavLink} from 'react-router-dom';
import {updateDeal} from 'store/deal/tasks';
import Icon from 'components/icon';
import InfoBox from 'components/info_box';
import Loading from 'components/loading';
import Search from 'components/search';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * This component renders a list of cars, based on store.deal.deal.cars.
 */
const DealCars = (state) => {
    const amountIncrease = 4;
    const [carRows, setCarRows] = useState(null);
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [showAddCars, setShowAddCars] = useState(true); // Holds JSX content.
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _addCars = async () => {
        let cars = state.search.selectedCars.map((num) => num.id.toString());
        if (Array.isArray(state.deal.deal.cars)) {
            cars = state.deal.deal.cars.concat(cars);
        } else {
            cars = [].concat(cars);
        }

        return await updateDeal({cars: cars});
    };

    const _stateCheck = () => {
        return !!(state && state.deal && state.deal.deal && state.deal.deal.cars);
    };

    useEffect(() => {
        const _removeCar = async (id) => {
            const cars = state.deal.deal.cars.filter((num) => num !== id);
            return await updateDeal({cars: cars});
        };

        const _renderCars = () => {
            let data = state.deal.deal.cars;

            // if no data, minimize widget.
            if (!data || (data && data.length === 0)) {
                setCarRows([]);
                return setMinimize(true);
            } else {
                setMinimize(false);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            data = data.slice(0, showAmount);

            setCarRows(data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderCarItem(num, (i === 0))}
                    </React.Fragment>
                );
            }));
        };

        const _renderCarItem = (regNr, firstItem) => {
            return (
                <div className='dealCarsWrapper__dealCars__content__cars__item'>
                    <div className='dealCarsWrapper__dealCars__content__cars__item__icon'>
                        <div className='dealCarsWrapper__dealCars__content__cars__item__icon__visible'>{<Icon val='car'/>}</div>
                        <div className='dealCarsWrapper__dealCars__content__cars__item__icon__hidden'><Tooltip horizontalDirection='right' verticalDirection={firstItem ? 'bottom' : 'top'}  tooltipContent={tc.removeCar}><Icon val='remove' onClick={async () => {return await _removeCar(regNr)}}/></Tooltip></div>
                    </div>
                    <NavLink exact to={'/bil/' + regNr} key={regNr}>
                        <div className='dealCarsWrapper__dealCars__content__cars__item__infoHolder'>
                            <p>{tc.regNumber}:</p>
                            <p className='dealCarsWrapper__dealCars__content__cars__item__infoHolder__regNum'>{regNr}</p>
                        </div>
                        <div className='dealCarsWrapper__dealCars__content__cars__item__linkHolder'>
                            <Tooltip horizontalDirection='left' verticalDirection={firstItem ? 'bottom' : 'top'}  tooltipContent={tc.navigateToCar}><Icon val='navigate'/></Tooltip>
                        </div>
                    </NavLink>
                </div>
            );
        };

        _renderCars();
    }, [showAmount, state.deal.deal.cars]);

    return ( _stateCheck() ?
            <div className='dealCarsWrapper'>
                <div className='dealCarsWrapper__dealCars'>
                    <div className='dealCarsWrapper__dealCars__header'>
                        <WidgetHeader
                            iconVal='person'
                            dashboard={
                                minimize ?
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                    </> :
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={showAddCars ? tc.hideConnectCars : tc.connectCars}><Icon active={showAddCars} val='link' onClick={() => {setShowAddCars(!showAddCars)}}/></Tooltip>
                                        {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                        {(showAmount < dataLength) && <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>}
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    </>
                            }
                            headline={tc.cars}
                            headlineSub={tc.handleCars}
                        />
                    </div>
                    {!minimize &&
                    <div className='dealCarsWrapper__dealCars__content'>
                        {showAddCars &&
                        <div className='dealCarsWrapper__dealCars__content__search'>
                            <Search type='cars' save={_addCars}/>
                        </div>
                        }
                        {(carRows && carRows.length) ?
                            <div className='dealCarsWrapper__dealCars__content__cars'>
                                {carRows}
                            </div> :
                            <InfoBox>
                                <h4>{tc.noVehicles}.</h4>
                                <p>{tc.carsHowTo}</p>
                            </InfoBox>

                        }
                    </div>
                    }
                </div>
            </div> :
            <Loading/>
    );
};


const MapStateToProps = (state) => {
    return {
        deal: state.deal,
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(DealCars);

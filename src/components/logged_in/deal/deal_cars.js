import React, {useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {NavLink} from 'react-router-dom';
import {updateDeal} from 'store/deal/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * This component renders a list of cars, based on store.deal.cars.
 */
const DealCars = (state) => {
    const amountIncrease = 6;
    const [showAddCars, setShowAddCars] = useState(false);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _addCars = async () => {
        const cars = state.search.selectedAll.map((num) => {
            return {
                id: num.id.toString(),
                name: num.id.toString(),
            }
        });
        return await updateDeal({carsToAdd: cars});
    };

    const _removeCar = async (id) => {
        const car = {
            id: id.toString(),
            name: id.toString(),
        };
        return await updateDeal({carsToRemove: [car]});
    };

    const _renderCarsList = () => {
        let data = state.deal.deal.cars;

        // Show more rows every time user click load icon.
        data = data.slice(0, showAmount);

        if (data.length) {
            return data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderCarItem(num)}
                    </React.Fragment>
                );
            });
        } else {
            return <p className='marginTop'>{tc.noCars}</p>;
        }
    };

    const _renderCarItem = (car) => {
        return (
            <div className='dealCarsWrapper__dealCars__content__cars__item'>
                <div className='dealCarsWrapper__dealCars__content__cars__item__icon'>
                    <div className='dealCarsWrapper__dealCars__content__cars__item__icon__visible'>{<Icon val='car'/>}</div>
                    <div className='dealCarsWrapper__dealCars__content__cars__item__icon__hidden'><Tooltip horizontalDirection='left' tooltipContent={tc.removeCar}><Icon val='remove' onClick={async () => {return await _removeCar(car.id)}}/></Tooltip></div>
                </div>
                <NavLink exact to={'/bil/' + car.id} key={car.id}>
                    <div className='dealCarsWrapper__dealCars__content__cars__item__regNum'>
                        <p>{tc.regNumber}:</p>
                        <p className='dealCarsWrapper__dealCars__content__cars__item__regNum__strong'>{car.id}</p>
                    </div>
                    <div className='dealCarsWrapper__dealCars__content__cars__item__linkHolder'>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToCar}><Icon val='navigate'/></Tooltip>
                    </div>
                </NavLink>
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(state && state.deal && state.deal.deal && state.deal.deal.cars);
    };

    return ( _stateCheck() ?
            <div className='dealCarsWrapper'>
                <div className='dealCarsWrapper__dealCars'>
                    <div className='dealCarsWrapper__dealCars__header'>
                        <WidgetHeader
                            iconVal='person'
                            dashboard={
                                <>
                                    {showAddCars ?
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.hideConnectCars}><Icon val='linkOff' onClick={() => {setShowAddCars(false)}}/></Tooltip> :
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.connectCars}><Icon val='link' onClick={() => {setShowAddCars(true)}}/></Tooltip>
                                    }
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                    {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                    {minimize ?
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> :
                                        <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    }
                                </>
                            }
                            headline={tc.cars}
                            headlineSub={tc.dealCarsInfo}
                        />
                    </div>
                    {!minimize &&
                    <div className='dealCarsWrapper__dealCars__content'>
                        {showAddCars &&
                        <div className='dealCarsWrapper__dealCars__content__search'>
                            <Search type='cars' save={_addCars}/>
                        </div>
                        }
                        <div className='dealCarsWrapper__dealCars__content__cars'>
                            {_renderCarsList()}
                        </div>
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

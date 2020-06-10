import React, {useEffect, useState} from 'react';
import {createDeal} from 'store/agile/tasks';
import {tc} from 'helpers';
import {connect} from 'react-redux';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Popup from 'components/popup';
import Search from 'components/search';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

/**
 * Render a component where user can create a new deal.
 * If target is provided, that prospect is included in the deal, otherwise it starts with an empty deal.
 * User always have the possibility to search for prospects to att to deal.
 * If target is provided user have the possibility to add cars from that targets fleet to deal.
 * If target is provided and state.props.type === 'company' and state.props.koncern === true user have the possibility to add companies from within that koncern to deal.
 *
 * @param state.props.close - func - Function to close component.
 * @param state.props.headline - string (optional) - If sub headline is wanted.
 * @param state.props.koncern - bool (optional) - If target is a company org nr and type === 'company' and the company is part of a koncern, this should be set to true.
 * @param state.props.target - string (optional) - Company org nr | person user id.
 * @param state.props.type - string (optional) - 'company' | 'person'
 */
const CreateDeal = (state) => {
    const [newDealObj, setNewDealObj] = useState({
        cars: (state.props.cars && Array.isArray(state.props.cars)) ? state.props.cars : [],
        contacts: [],
        description: '',
        maturity: null,
        name: '',
        prospects: (state.props.prospects && Array.isArray(state.props.prospects)) ? state.props.prospects : [],
        responsible: null,
    });

    const _addSelectedCarsToDealObj = () => {
        setNewDealObj({
            ...newDealObj,
            cars: newDealObj.cars.concat(state.search.selectedCars),
        })
    };

    const _addSelectedContactsToDealObj = () => {
        setNewDealObj({
            ...newDealObj,
            contacts: newDealObj.contacts.concat(state.search.selectedContacts),
        })
    };

    const _addSelectedKoncernCompaniesToDealObj = () => {
        setNewDealObj({
            ...newDealObj,
            prospects: newDealObj.prospects.concat(state.search.selectedKoncernCompanies),
        })
    };

    const _addSelectedProspectsToDealObj = () => {
        setNewDealObj({
            ...newDealObj,
            prospects: newDealObj.prospects.concat(state.search.selectedAll),
        })
    };

    const _removeProspectFromDealObj = (id) => {
        setNewDealObj({
            ...newDealObj,
            prospects: newDealObj.prospects.filter((num) => num.id !== id),
        });
    };

    const _saveDeal = async () => {
        state.props.close();
        return await createDeal();
    };

    const _stateCheck = () => {
        return !!(state && state.props && state.search && newDealObj && Object.keys(newDealObj).length);
    };

    // useEffect(() => {
    //     if (newDealObj && state.props) {
    //         console.log('Inne i IF', state.props.prospects);
    //         setNewDealObj({
    //             cars: (state.props.cars && Array.isArray(state.props.cars)) ? state.props.cars : [],
    //             contacts: [],
    //             description: '',
    //             maturity: null,
    //             name: '',
    //             prospects: (state.props.prospects && Array.isArray(state.props.prospects)) ? state.props.prospects : [],
    //             responsible: null,
    //         });
    //
    //         setTimeout(() => {
    //             console.log('newdealobj', newDealObj);
    //         }, 2000);
    //     }
    // }, [state.props]);

    return (_stateCheck() ?
        <Popup close={state.props.close} size='big'>
            <div className='createDealWrapper'>
                <div className='createDealWrapper__createDeal'>
                    <div className='createDealWrapper__createDeal__header'>
                        <WidgetHeader
                            iconVal='add'
                            headline={tc.createNewDeal}
                            headlineSub={state.props.headline ? state.props.headline : null}
                        />
                    </div>
                    <div className='createDealWrapper__createDeal__content'>
                        <div className='createDealWrapper__createDeal__content__section'>
                            <h5>{tc.deal}</h5>
                            <div className='createDealWrapper__createDeal__content__section__item'>
                                <p>{tc.prospects}:</p>
                                <p>
                                    {newDealObj.prospects.map((num, i) => {
                                        return (<span className='chip' key={i}>{num.name}<Icon val='clear' onClick={_removeProspectFromDealObj(num.id)}/></span>);
                                    })}
                                </p>
                            </div>
                            <div className='createDealWrapper__createDeal__content__section__item'>
                                Rendera bilar som ingår.... ska gå att ta bort
                            </div>
                        </div>
                        <div className='createDealWrapper__createDeal__content__section'>
                            <h5>{tc.addConnectionsToDeal}</h5>
                            <div className='createDealWrapper__createDeal__content__section__item'>
                                <Search type='all' save={_addSelectedProspectsToDealObj}/>
                            </div>
                            {(state.props.koncern && state.props.target) ?
                                <div className='createDealWrapper__createDeal__content__section__item'>
                                    <Search target={state.props.target} type='koncernCompanies' save={_addSelectedKoncernCompaniesToDealObj}/>
                                </div> : null
                            }
                            {state.props.target ?
                                <div className='createDealWrapper__createDeal__content__section__item'>
                                    <Search target={state.props.target} type='cars' save={_addSelectedCarsToDealObj}/>
                                </div> : null
                            }
                            <div className='createDealWrapper__createDeal__content__section__item'>
                                <Search type='contacts' save={_addSelectedContactsToDealObj}/>
                            </div>
                        </div>
                    </div>
                    <div className='createDealWrapper__createDeal__footer'>
                        <WidgetFooter save={_saveDeal}/>
                    </div>
                </div>
            </div>
        </Popup> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        props: props,
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(CreateDeal);

import React, {useEffect, useRef, useState} from 'react';
import {createDeal} from 'store/agile/tasks';
import ReactS3Uploader from 'react-s3-uploader';
import carHelper from 'shared_helpers/car_helper';
import {dealHelper, tc} from 'helpers';
import {connect} from 'react-redux';
import {Dropdown, DropdownItem} from 'components/dropdown';
import ColleaguesDropdown from 'components/colleagues_dropdown';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Popup from 'components/popup';
import Search from 'components/search';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

/**
 * Render a component where user can create a new deal.
 *
 * If target is provided, that prospect is included in the deal, otherwise it starts with an empty deal.
 * User always have the possibility to search for prospects to att to deal.
 * If target is provided and state.props.koncern === true user have the possibility to add specific cars from koncern fleet to deal.
 * If target is provided and state.props.koncern === true user have the possibility to add companies from within that koncern to deal.
 *
 * @param state.props.close - func - Function to close component. Send param true when deal is created.
 * @param state.props.headline - string (optional) - If sub headline is wanted.
 * @param state.props.koncern - bool (optional) - If target is a company org nr and type === 'company' and the company is part of a koncern, this should be set to true.
 * @param state.props.target - string (optional) - Company org nr | person user id.
 */
const CreateDeal = (state) => {
    const [newDealObj, setNewDealObj] = useState({});
    const newDealDescriptionInputRef = useRef(null);
    const newDealNameInputRef = useRef(null);
    const newDealPotentialInputRef = useRef(null);

    useEffect(() => {
        if (state.props && state.user && state.user.info) {
            setNewDealObj({
                cars: (state.props.cars && Array.isArray(state.props.cars)) ? state.props.cars : [],
                contacts: [],
                description: '',
                files: [],
                maturity: null,
                name: '',
                prospects: (state.props.prospects && Array.isArray(state.props.prospects)) ? state.props.prospects : [],
                user_id: state.user.info.id,
                userName: state.user.info.name,
            });
        }
    }, [state.props, state.user]);

    const _addSelectedCarsToDealObj = () => {
        const selected = state.search.selectedCars.filter((num) => {
            return !(newDealObj.cars.find((x) => x.id === num.id));
        });

        setNewDealObj({
            ...newDealObj,
            cars: newDealObj.cars.concat(selected),
        })
    };

    const _addSelectedContactsToDealObj = () => {
        const selected = state.search.selectedContacts.filter((num) => {
            return !(newDealObj.contacts.find((x) => x.id === num.id));
        });

        setNewDealObj({
            ...newDealObj,
            contacts: newDealObj.contacts.concat(selected),
        })
    };

    const _addSelectedKoncernCompaniesToDealObj = () => {
        const selected = state.search.selectedKoncernCompanies.filter((num) => {
            return !(newDealObj.prospects.find((x) => x.id === num.id));
        });

        setNewDealObj({
            ...newDealObj,
            prospects: newDealObj.prospects.concat(selected),
        })
    };

    const _addSelectedProspectsToDealObj = () => {

        const cars = [];
        const prospects = [];

        // selectedAll can contain prospects aswll as car reg numbers, so we need to put them in the correct array for deal.
        state.search.selectedAll.forEach((num) => {
            if (carHelper.isValidRegNumber(num.id)) {
                // No duplicates.
                if (!(newDealObj.cars.find((x) => x.id === num.id))) {
                    cars.push(num);
                }
            } else {
                // No duplicates.
                if (!(newDealObj.prospects.find((x) => x.id === num.id))) {
                    prospects.push(num);
                }
            }
        });

        setNewDealObj({
            ...newDealObj,
            cars: newDealObj.cars.concat(cars),
            prospects: newDealObj.prospects.concat(prospects),
        })
    };

    const _finishUpload = async (e, f) => {
        setNewDealObj({
            ...newDealObj,
            files: newDealObj.files.concat([{
                s3_filename: e.filename,
                original_name: f.name,
            }])
        });
    };

    const _onInputChange = () => {
        setNewDealObj({
            ...newDealObj,
            description: (newDealDescriptionInputRef && newDealDescriptionInputRef.current) ? newDealDescriptionInputRef.current.value : newDealObj.description,
            name: (newDealNameInputRef && newDealNameInputRef.current) ? newDealNameInputRef.current.value : newDealObj.name,
            potential: (newDealPotentialInputRef && newDealPotentialInputRef.current) ? newDealPotentialInputRef.current.value : newDealObj.potential,
        });
    };

    const _removeCarFromDealObj = (id) => {
        setNewDealObj({
            ...newDealObj,
            cars: newDealObj.cars.filter((num) => num.id !== id),
        });
    };

    const _removeContactFromDealObj = (id) => {
        setNewDealObj({
            ...newDealObj,
            contacts: newDealObj.contacts.filter((num) => num.id !== id),
        });
    };

    const _removeFileFromDealObj = (s3_filename) => {
        setNewDealObj({
            ...newDealObj,
            files: newDealObj.files.filter((num) => num.s3_filename !== s3_filename),
        });
    };

    const _removeProspectFromDealObj = (id) => {
        setNewDealObj({
            ...newDealObj,
            prospects: newDealObj.prospects.filter((num) => num.id !== id),
        });
    };

    const _renderMaturityList = () => {
        return (
            <Dropdown displayValue={dealHelper.getMaturityName(newDealObj.maturity)}>
                {dealHelper.getMaturityList().map((num) => {
                    return(
                        <DropdownItem
                            active={num.id === newDealObj.maturity}
                            key={num.id}
                            label={num.name}
                            onClick={() => {
                                setNewDealObj({
                                    ...newDealObj,
                                    maturity: num.id,
                                });
                            }}/>
                    );
                })}
            </Dropdown>
        );
    };

    const _saveDeal = async () => {
        await createDeal(newDealObj);
        return state.props.close(true);
    };

    const _startFileUpload = () => {
        document.querySelector('#s3Uploader').click();
    };

    const _stateCheck = () => {
        return !!(state && state.props && state.search && newDealObj && Object.keys(newDealObj).length);
    };

    const _uploadError = (message) => {
        console.error('S3 file upload error:', message);
    };

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
                        <div className='createDealWrapper__createDeal__content__left'>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <input onChange={_onInputChange} placeholder={tc.dealName} ref={newDealNameInputRef} type='text' value={newDealObj.name || ''}/>
                            </div>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <input onChange={_onInputChange} placeholder={tc.dealPotential} ref={newDealPotentialInputRef} type='text' value={newDealObj.potential || ''}/>
                            </div>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <ColleaguesDropdown
                                    activeId={newDealObj.user_id}
                                    activeName={newDealObj.userName}
                                    onClick={(id, name) => {
                                    setNewDealObj({
                                        ...newDealObj,
                                        user_id: id,
                                        userName: name
                                    });
                                }}/>
                            </div>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <Search type='all' save={_addSelectedProspectsToDealObj}/>
                            </div>
                            {(state.props.koncern && state.props.target) ?
                                <div className='createDealWrapper__createDeal__content__item'>
                                    <Search target={state.props.target} type='koncernCompanies' save={_addSelectedKoncernCompaniesToDealObj}/>
                                </div> : null
                            }
                            <div className='createDealWrapper__createDeal__content__item'>
                                <div className='createDealWrapper__createDeal__content__item__chipholder'>
                                    <div className='createDealWrapper__createDeal__content__item__chipholder__label'>{tc.prospects}:</div>
                                    {
                                        newDealObj.prospects.length ? newDealObj.prospects.map((num, i) => {
                                                if (num.id.toString() === state.props.target.toString()) {
                                                    return (
                                                        <div className='createDealWrapper__createDeal__content__item__chipholder__chip' key={i}>
                                                            {num.name}
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className='createDealWrapper__createDeal__content__item__chipholder__chip' key={i}>
                                                            {num.name}
                                                            <Icon val='clear' onClick={() => {_removeProspectFromDealObj(num.id)}}/>
                                                        </div>
                                                    );
                                                }
                                            }) :
                                            <div className='createDealWrapper__createDeal__content__item__chipholder__info'>{tc.noProspectConnections}</div>
                                    }
                                </div>
                            </div>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <div className='createDealWrapper__createDeal__content__item__chipholder'>
                                    <div className='createDealWrapper__createDeal__content__item__chipholder__label'>{tc.files}:</div>
                                    {
                                        newDealObj.files.length ? newDealObj.files.map((num, i) => {
                                            return (
                                                <div className='createDealWrapper__createDeal__content__item__chipholder__chip' key={i}>
                                                    {num.original_name}
                                                    <Icon val='clear' onClick={() => {_removeFileFromDealObj(num.s3_filename)}}/>
                                                </div>
                                            );
                                        }) :
                                        <div className='createDealWrapper__createDeal__content__item__chipholder__info'>{tc.noFiles}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='createDealWrapper__createDeal__content__right'>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <input onChange={_onInputChange} placeholder={tc.description} ref={newDealDescriptionInputRef} type='text' value={newDealObj.description || ''}/>
                            </div>
                            <div className='createDealWrapper__createDeal__content__item'>
                                {_renderMaturityList()}
                            </div>
                            <div className='createDealWrapper__createDeal__content__item'>
                                <button onClick={_startFileUpload}>{tc.uploadFile}</button>
                            </div>
                            {(state.props.koncern && state.props.target) ?
                                <div className='createDealWrapper__createDeal__content__item'>
                                    <Search target={state.props.target} type='cars' save={_addSelectedCarsToDealObj}/>
                                </div> : null
                            }
                            <div className='createDealWrapper__createDeal__content__item'>
                                <Search type='contacts' save={_addSelectedContactsToDealObj}/>
                            </div>
                            {(state.props.target && state.props.koncern) &&
                                <div className='createDealWrapper__createDeal__content__item'>
                                    <div className='createDealWrapper__createDeal__content__item__chipholder'>
                                        <div
                                            className='createDealWrapper__createDeal__content__item__chipholder__label'>{tc.vehicles}:
                                        </div>
                                        {
                                            newDealObj.cars.length ? newDealObj.cars.map((num, i) => {
                                                    return (
                                                        <div className='createDealWrapper__createDeal__content__item__chipholder__chip'
                                                             key={i}>
                                                            {num.name}
                                                            <Icon val='clear' onClick={() => {
                                                                _removeCarFromDealObj(num.id)
                                                            }}/>
                                                        </div>
                                                    );
                                                }) :
                                                <div
                                                    className='createDealWrapper__createDeal__content__item__chipholder__info'>{tc.noVehicleConnections}</div>
                                        }
                                    </div>
                                </div>
                            }
                            <div className='createDealWrapper__createDeal__content__item'>
                                <div className='createDealWrapper__createDeal__content__item__chipholder'>
                                    <div className='createDealWrapper__createDeal__content__item__chipholder__label'>{tc.contacts}:</div>
                                    {
                                        newDealObj.contacts.length ? newDealObj.contacts.map((num, i) => {
                                            return (
                                                <div className='createDealWrapper__createDeal__content__item__chipholder__chip' key={i}>
                                                    {num.name}
                                                    <Icon val='clear' onClick={() => {_removeContactFromDealObj(num.id)}}/>
                                                </div>
                                            );
                                        }) :
                                        <div className='createDealWrapper__createDeal__content__item__chipholder__info'>{tc.noContactConnections}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='hidden'>
                            <ReactS3Uploader
                                id='s3Uploader'
                                signingUrl='/s3/sign'
                                onFinish={_finishUpload}
                                onError={_uploadError}
                                contentDisposition='auto'
                            />
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
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(CreateDeal);

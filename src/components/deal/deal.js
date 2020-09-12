import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getDeal, updateDeal} from 'store/deal/tasks';
import {setPreviewId} from 'store/agile/tasks';
import colors from '../../styles/_colors.scss';
import {RoughNotation} from "react-rough-notation";
import {dealHelper, tc} from 'helpers';
import moment from 'moment';
import Activities from 'components/activities';
import ColleaguesDropdown from 'components/colleagues_dropdown';
import Comment from 'components/comment';
import Contacts from 'components/contacts';
import DealCars from './deal_cars';
import DealFiles from './deal_files';
import DealProspects from './deal_prospects';
import {Dropdown, DropdownItem} from 'components/dropdown';
import history from '../../router_history';
import Events from 'components/events';
import Loading from 'components/loading';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const {id} = useParams();
    const [dataIsCollected, setDataIsCollected] = useState(false);
    const [editDeal, setEditDeal] = useState(false);
    const [dealObj, setDealObj] = useState({});
    const [showComment, setShowComment] = useState(false);
    const dealDescriptionInputRef = useRef(null);
    const dealNameInputRef = useRef(null);
    const dealPotentialInputRef = useRef(null);

    useEffect(() => {
        const getData = async () => {
            await getDeal({id: id});
            // We use this flag to prevent sub components to retrieve information for previous deal in store.
            setDataIsCollected(true);
        };

        getData();
    }, [id]);

    useEffect(() => {
        if (state.deal && state.deal.deal) {
            // Set properties that we should be able to edit. Make sure they correlate to params in updateDeal.
            setDealObj({
                description: state.deal.deal.description,
                maturity: state.deal.deal.maturity,
                name: state.deal.deal.name,
                potential: state.deal.deal.potential,
                user_id: state.deal.deal.user_id,
                userName: state.deal.deal.userName, // This is for frontend display, when changing user we only send user id.
            });
        }
    }, [state.deal]);

    const _onInputChange = () => {
        setDealObj({
            ...dealObj,
            description: dealDescriptionInputRef.current.value,
            name: dealNameInputRef.current.value,
            potential: dealPotentialInputRef.current.value,
        });
    };

    const _openInAgile = () => {
        setPreviewId(id);
        history.push('/bearbeta')
    };

    const _renderMaturityList = () => {
        return (
            <Dropdown displayValue={dealHelper.getMaturityName(dealObj.maturity)} transparent={true}>
                {dealHelper.getMaturityList().map((num) => {
                    return(
                        <DropdownItem
                            active={num.id === dealObj.maturity}
                            key={num.id}
                            label={num.name}
                            onClick={() => {
                                setDealObj({
                                    ...dealObj,
                                    maturity: num.id,
                                });
                            }}/>
                    );
                })}
            </Dropdown>
        );
    };

    const _setDealObjFromStore = () => {
        if (state.deal && state.deal.deal) {
            // Set properties that we should be able to edit. Make sure they correlate to params in updateDeal.
            setDealObj({
                description: state.deal.deal.description,
                maturity: state.deal.deal.maturity,
                name: state.deal.deal.name,
                potential: state.deal.deal.potential,
                user_id: state.deal.deal.user_id,
                userName: state.deal.deal.userName, // This is for frontend display, when changing user we only care send user id.
            });
        }
    };

    const _saveChanges = async () => {
        setEditDeal(false);
        return await updateDeal(dealObj);
    };

    const _stateCheck = () => {
        return (dataIsCollected && dealObj && Object.keys(dealObj).length > 0 && state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='dealWrapper__deal'>
                <div className='dealWrapper__deal__header'>
                    <div className='dealWrapper__deal__header__left'>
                        <div className='dealWrapper__deal__header__left__top'>
                            <h4>{tc.deal}</h4>
                            {editDeal ?
                                <RoughNotation animationDuration={500} color={colors.informatory} type='underline' show={editDeal} strokeWidth={3}>
                                    <input className='large' onChange={_onInputChange} ref={dealNameInputRef} type='text' value={(dealObj.name) ? dealObj.name : ''}/>
                                </RoughNotation> :
                                <h3>{state.deal.deal.name}</h3>
                            }
                        </div>
                        <div className='dealWrapper__deal__header__left__bottom'>
                            <div className='dealWrapper__deal__header__left__bottom__item'>
                                <h5>{tc.owner}:</h5>
                                {editDeal ?
                                    <RoughNotation animationDuration={500} color={colors.informatory} type='underline' show={editDeal} strokeWidth={2}>
                                        <ColleaguesDropdown
                                            activeId={dealObj.user_id}
                                            activeName={dealObj.userName}
                                            transparent={true}
                                            onClick={(id, name) => {
                                                setDealObj({
                                                    ...dealObj,
                                                    user_id: id,
                                                    userName: name
                                                });
                                            }}/>
                                    </RoughNotation> :
                                    <p>{dealObj.userName}</p>
                                }
                            </div>
                            <div className='dealWrapper__deal__header__left__bottom__item'>
                                <h5>{tc.description}:</h5>
                                {editDeal ?
                                    <RoughNotation animationDuration={500} color={colors.informatory} type='underline' show={editDeal} strokeWidth={2}>
                                        <input className='medium' onChange={_onInputChange} ref={dealDescriptionInputRef} type='text' value={(dealObj.description) ? dealObj.description : ''}/>
                                    </RoughNotation> :
                                        <p>{dealObj.description}</p>
                                }
                            </div>
                            {!editDeal &&
                                <div className='dealWrapper__deal__header__left__bottom__item'>
                                    <h5>{tc.status}:</h5>
                                    <p>{dealHelper.getReadablePhase(state.deal.deal.phase)}</p>
                                </div>
                            }
                            {!editDeal &&
                                <div className='dealWrapper__deal__header__left__bottom__item'>
                                    <h5>{tc.savedInList}:</h5>
                                    <p>{state.deal.listName}</p>
                                </div>
                            }
                            {!editDeal &&
                                <div className='dealWrapper__deal__header__left__bottom__item'>
                                    <h5>{tc.lastUpdate}:</h5>
                                    <p>{moment(new Date(state.deal.deal.updated)).fromNow()}</p>
                                </div>
                            }
                            <div className='dealWrapper__deal__header__left__bottom__item'>
                                <h5>{tc.potential}:</h5>
                                {editDeal ?
                                    <RoughNotation animationDuration={500} color={colors.informatory} type='underline' show={editDeal} strokeWidth={2}>
                                        <input className='small' onChange={_onInputChange} ref={dealPotentialInputRef} type='text' value={(dealObj.potential) ? dealObj.potential : ''}/>
                                    </RoughNotation> :
                                    <p>{dealObj.potential}</p>
                                }
                            </div>
                            <div className='dealWrapper__deal__header__left__bottom__item'>
                                <h5>{tc.maturity}:</h5>
                                {editDeal ?
                                    <RoughNotation animationDuration={500} color={colors.informatory} type='underline' show={editDeal} strokeWidth={2}>
                                        { _renderMaturityList()}
                                    </RoughNotation> :
                                    <p>{dealHelper.getMaturityName(dealObj.maturity)}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='dealWrapper__deal__header__right'>
                        {!editDeal &&
                        <div className='dealWrapper__deal__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}>
                                <Icon val='comment' onClick={() => {setShowComment(true)}}/>
                            </Tooltip>
                        </div>
                        }
                        {!editDeal &&
                        <div className='dealWrapper__deal__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.openInAgile}>
                                <Icon val='agile' onClick={_openInAgile}/>
                            </Tooltip>
                        </div>
                        }
                        {(!editDeal && state.user.info.id === state.deal.deal.user_id) &&
                        <div className='dealWrapper__deal__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.editDeal}>
                                <Icon val='edit' onClick={() => {setEditDeal(true)}}/>
                            </Tooltip>
                        </div>
                        }
                        {editDeal &&
                        <div className='dealWrapper__deal__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}>
                                <Icon val='clear' onClick={() => {
                                    setEditDeal(false);
                                    _setDealObjFromStore();
                                }}/>
                            </Tooltip>
                        </div>
                        }
                        {editDeal &&
                        <div className='dealWrapper__deal__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.saveChanges}>
                                <Icon active={true} val='save' onClick={_saveChanges}/>
                            </Tooltip>
                        </div>
                        }
                    </div>
                </div>
                <div className='dealWrapper__deal__content'>
                    {showComment && <Comment close={() => {setShowComment(false)}} headline={tc.deal + ': ' + dealObj.name} target={id} type='new'/>}
                    <div className='dealWrapper__deal__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <DealFiles/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <Contacts entityId={state.deal.deal._id} entityType='deal'/>
                    </div>
                    <div className='dealWrapper__deal__content__itemsContainer'>
                        <DealProspects isRemovable={state.user.info.id === state.deal.deal.user_id}/>
                        <DealCars isRemovable={state.user.info.id === state.deal.deal.user_id}/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <Activities includeComments={true} includeMoved={true} target={id} type='target'/>
                    </div>
                </div>
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        deal: state.deal,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Deal);

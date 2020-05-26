import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getDeal, updateDeal} from 'store/deal/tasks';
import {dealHelper, tc} from 'helpers';
import moment from 'moment';
import Activities from 'components/logged_in/activities';
import Comment from 'components/logged_in/comment';
import Contacts from 'components/logged_in/contacts';
import DealCars from './deal_cars';
import DealFiles from './deal_files';
import DealProspects from './deal_prospects';
import {Dropdown, DropdownItem, DropdownItemDelimiter} from 'components/shared/dropdown';
import Events from 'components/logged_in/events';
import Loading from 'components/shared/loading';
import Icon from 'components/shared/icon';
import Popup from 'components/shared/popup';
import Tooltip from 'components/shared/tooltip/tooltip';

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const [editDeal, setEditDeal] = useState(false);
    const [dealObj, setDealObj] = useState({});
    const [showComment, setShowComment] = useState(false);
    const {id} = useParams();
    const dealDescriptionInputRef = useRef(null);
    const dealNameInputRef = useRef(null);
    const dealPotentialInputRef = useRef(null);

    const _onInputChange = () => {
        setDealObj({
            ...dealObj,
            description: dealDescriptionInputRef.current.value,
            name: dealNameInputRef.current.value,
            potential: dealPotentialInputRef.current.value,
        });
    };

    const _openInAgile = () => {
        console.log('Öppna i Bearbeta');
    };

    const _renderColleagueList = () => {
        let colleagues = [];

        if (state && state.user && state.user.connections && state.user.connections.length) {
            // Render colleagues with dealer name delimiter, first the users own dealer...
            colleagues = [<DropdownItemDelimiter key={state.user.info.dealerName} label={state.user.info.dealerName}/>];
            colleagues = colleagues.concat(state.user.colleagues.map((user, i) => {
                return(
                    <DropdownItem
                        active={dealObj.user_id === user.id}
                        key={user.id}
                        label={user.name}
                        onClick={() => {
                            setDealObj({
                                ...dealObj,
                                user_id: user.id,
                                userName: user.name
                            });
                        }}
                    />
                );
            }));

            // ...then the connections.
            colleagues = colleagues.concat(state.user.connections.map((dealer, i) => {
                const items = [];
                items.push(
                    <DropdownItemDelimiter key={dealer.name} label={dealer.name}/>
                );
                dealer.users.forEach((user) => {
                    items.push(
                        <DropdownItem
                            active={dealObj.user_id === user.id}
                            key={user.id}
                            label={user.name}
                            onClick={() => {
                                setDealObj({
                                    ...dealObj,
                                    user_id: user.id,
                                    userName: user.name
                                });
                            }}
                        />
                    );
                });
                return items;
            }));
        } else {
            colleagues = state.user.colleagues.map((user, i) => {
                // Render colleagues without delimiter.
                return (
                    <DropdownItem
                        active={dealObj.user_id === user.id}
                        key={user.id}
                        label={user.name}
                        onClick={() => {
                            setDealObj({
                                ...dealObj,
                                user_id: user.id,
                                userName: user.name
                            });
                        }}
                    />
                );
            })
        }

        return (
            <Dropdown displayValue={dealObj.userName} highlight={true}>
                {colleagues}
            </Dropdown>
        );
    };

    const _renderMaturityList = () => {
        return (
            <Dropdown displayValue={dealHelper.getMaturityName(dealObj.maturity)} highlight={true}>
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
        return (dealObj && Object.keys(dealObj).length > 0 && state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    useEffect(() => {
        getDeal({id: id});
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

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='dealWrapper__deal'>
                <div className='dealWrapper__deal__header'>
                    <div className='dealWrapper__deal__header__top'>
                        <div className='dealWrapper__deal__header__top__left'>
                            <h4>{tc.deal}</h4>
                            {editDeal ?
                                <input className='name' onChange={_onInputChange} ref={dealNameInputRef} type='text' value={(dealObj.name) ? dealObj.name : ''}/> :
                                <h3>{state.deal.deal.name}</h3>
                            }
                        </div>
                        <div className='dealWrapper__deal__header__top__right'>
                            {!editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}><Icon val='comment' onClick={() => {setShowComment(true)}}/></Tooltip>}
                            {!editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.openInAgile}><Icon val='agile' onClick={_openInAgile}/></Tooltip>}
                            {!editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.editDeal}><Icon val='edit' onClick={() => {setEditDeal(true)}}/></Tooltip>}
                            {editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {
                                setEditDeal(false)
                                _setDealObjFromStore();
                            }}/></Tooltip> }
                            {editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.saveChanges}><Icon active={true} val='save' onClick={_saveChanges}/></Tooltip>}
                        </div>
                    </div>
                    <div className='dealWrapper__deal__header__bottom'>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.responsible}</h4>
                            {editDeal ?
                                _renderColleagueList() :
                                <p>{dealObj.userName}</p>
                            }
                        </div>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.descriptionDeal}</h4>
                            {editDeal ?
                                <input className='name' onChange={_onInputChange} ref={dealDescriptionInputRef} type='text' value={(dealObj.description) ? dealObj.description : ''}/> :
                                <p>{dealObj.description}</p>
                            }
                        </div>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.status}</h4>
                            <p>{dealHelper.getReadablePhase(state.deal.deal.phase)}</p>
                        </div>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.savedInList}</h4>
                            <p>{state.deal.listName}</p>
                        </div>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.lastUpdate}</h4>
                            <p>{moment(state.deal.deal.updated).fromNow()}</p>
                        </div>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.potential}</h4>
                            {editDeal ?
                                <input className='name' onChange={_onInputChange} ref={dealPotentialInputRef} type='text' value={(dealObj.potential) ? dealObj.potential : ''}/> :
                                <p>{dealObj.potential}</p>
                            }
                        </div>
                        <div className='dealWrapper__deal__header__bottom__item'>
                            <h4>{tc.maturity}</h4>
                            {editDeal ?
                                _renderMaturityList() :
                                dealHelper.getMaturityName(dealObj.maturity)
                            }
                        </div>
                    </div>
                </div>
                <div className='dealWrapper__deal__content'>
                    {showComment && <Popup close={() => {setShowComment(false)}} size='small'><Comment close={() => {setShowComment(false)}} target={id} type='new'/></Popup>}
                    <div className='dealWrapper__deal__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <DealFiles/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <Contacts target={state.deal.deal._id} type='deal'/>
                    </div>
                    <div className='dealWrapper__deal__content__itemsContainer'>
                        <DealProspects/>
                        <DealCars/>
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

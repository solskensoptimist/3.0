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
import DealProspects from './deal_prospects';
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
    const [dealObj, setDealObj] = useState({
        name: '',
    });
    const [showComment, setShowComment] = useState(false);
    const {id} = useParams();
    const dealNameInputRef = useRef(null);

    const _onEditChange = () => {
        setDealObj({
            name: dealNameInputRef.current.value,
        });
    };

    const _openInAgile = () => {
        console.log('Öppna i Bearbeta');
    };

    const _saveChanges = async () => {
        console.log('Spara ändringar', dealObj);
        // updateDeal med dealObj... behöver bara mappa upp en bra payload...
        setEditDeal(false);
        return await updateDeal(dealObj);
    };

    const _startEditDeal = () => {
        // Set properties that we should be able to edit.
        setDealObj({
            name: state.deal.deal.name,
        });
        setEditDeal(true);
    };

    const _stateCheck = () => {
        return (state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    useEffect(() => {
        getDeal({id: id});
    }, [id]);

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='dealWrapper__deal'>
                <div className='dealWrapper__deal__header'>
                    <div className='dealWrapper__deal__header__top'>
                        <h4>{tc.deal}:</h4>
                        {editDeal ?
                            <input className='name' onChange={_onEditChange} ref={dealNameInputRef} type='text' value={dealObj.name}/> :
                            <h3>{state.deal.deal.name}</h3>
                        }
                    </div>
                    <div className='dealWrapper__deal__header__bottom'>
                        <div className='dealWrapper__deal__header__bottom__left'>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.status}</h4>
                                <p>{dealHelper.getReadablePhase(state.deal.deal.phase)}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.savedInList}</h4>
                                <p>{state.deal.listName}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.responsible}</h4>
                                <p>{state.deal.deal.userName}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.created}</h4>
                                <p>{moment(state.deal.deal.created).format('YYYY-MM-DD HH:mm')}</p>
                            </div>
                            <div className='dealWrapper__deal__header__bottom__left__item'>
                                <h4>{tc.lastUpdate}</h4>
                                <p>{moment(state.deal.deal.updated).fromNow()}</p>
                            </div>
                        </div>
                        <div className='dealWrapper__deal__header__bottom__right'>
                            <div className='dealWrapper__deal__header__bottom__right__item'>
                                {!editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}><Icon val='comment' onClick={() => {setShowComment(true)}}/></Tooltip>}
                                {!editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.openInAgile}><Icon val='agile' onClick={_openInAgile}/></Tooltip>}
                                {editDeal && <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setEditDeal(false)}}/></Tooltip> }
                                {editDeal ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.saveChanges}><Icon active={true} val='save' onClick={_saveChanges}/></Tooltip> :
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.editDeal}><Icon val='edit' onClick={_startEditDeal}/></Tooltip>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dealWrapper__deal__content'>
                    {state.deal.updatingDeal && <Loading size='full'/>}
                    {showComment && <Popup close={() => {setShowComment(false)}} size='small'><Comment close={() => {setShowComment(false)}} target={id} type='new'/></Popup>}
                    <div className='dealWrapper__deal__content__item'>
                        <Contacts target={state.deal.deal._id}/>
                    </div>
                    <div className='dealWrapper__deal__content__itemsContainer'>
                        <DealProspects/>
                        <DealCars/>
                    </div>
                    <div className='dealWrapper__deal__content__item'>
                        <Events target={id} type='target' view='flow'/>
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
    };
};

export default connect(
    MapStateToProps,
)(Deal);

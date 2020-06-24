import React, {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCompany, setResponsibility} from 'store/company/tasks';
import {tc} from 'helpers';
import Activities from 'components/activities';
import ColleaguesDropdown from 'components/colleagues_dropdown';
import Comment from 'components/comment';
import Contacts from 'components/contacts';
import CreateDeal from 'components/create_deal';
import Events from 'components/events';
import Fleet from 'components/fleet';
import KoncernInformation from './koncern_information';
import KoncernStructure from './koncern_structure';
import Loading from 'components/loading';
import Icon from 'components/icon';
import SaveToList from 'components/save_to_list';
import Tooltip from 'components/tooltip';

const Koncern= (state) => {
    const {id} = useParams();
    const [changeResponsible, setChangeResponsible] = useState(false);
    const [dataIsCollected, setDataIsCollected] = useState(false);
    const [responsibleObj, setResponsibleObj] = useState({});
    const [showComment, setShowComment] = useState(false);
    const [showCreateDeal, setShowCreateDeal] = useState(false);
    const [showSaveToList, setShowSaveToList] = useState(false);

    const _saveResponsible = async () => {
        setChangeResponsible(false);
        return await setResponsibility({entityId: state.company.company.user_id, responsibleUserId: responsibleObj.responsibleUserId});
    };

    const _stateCheck = () => {
        return (dataIsCollected && state && state.company && state.company.company && Object.keys(state.company.company).length);
    };

    useEffect(() => {
        const getData = async () => {
            await getCompany({id: id});
            // This flag is to prevent sub components to retrieve information for previous koncern in store.
            setDataIsCollected(true);
        };

        getData();
    }, [id]);

    useEffect(() => {
        if (state.company && state.company.responsible) {
            setResponsibleObj(state.company.responsible);
        } else {
            setResponsibleObj({
                responsibleUserId: null,
                responsibleUserName: '',
            });
        }
    }, [state.company]);

    return ( _stateCheck() ?
            <div className='koncernWrapper'>
                <div className='koncernWrapper__koncern'>
                    <div className='koncernWrapper__koncern__header'>
                        <div className='koncernWrapper__koncern__header__left'>
                            <div className='koncernWrapper__koncern__header__left__top'>
                                <h4>{tc.koncern}</h4>
                                <h3>{state.company.company.name}</h3>
                            </div>
                            <div className='koncernWrapper__koncern__header__left__bottom'>
                                <div className='koncernWrapper__koncern__header__left__bottom__item'>
                                    <h5>{tc.owner}:</h5>
                                    {changeResponsible ?
                                        <ColleaguesDropdown
                                            activeId={responsibleObj.responsibleUserId}
                                            activeName={responsibleObj.responsibleUserName}
                                            highlight={true}
                                            onClick={(id, name) => {
                                                setResponsibleObj({
                                                    ...responsibleObj,
                                                    responsibleUserId: id,
                                                    responsibleUserName: name,
                                                });
                                            }}/> :
                                        <p>{responsibleObj.responsibleUserName ? responsibleObj.responsibleUserName : <span className='italic'>{tc.noOwner}</span>}</p>
                                    }
                                </div>
                                {!changeResponsible &&
                                <div className='koncernWrapper__koncern__header__left__bottom__item'>
                                    <h5>{tc.partOfDeals}:</h5>
                                    {(state.company.deals && state.company.deals.length) &&
                                    <div className='koncernWrapper__koncern__header__left__bottom__item__dealsHolder'>
                                        {state.company.deals.map((num, i) => {
                                            if (num._id) {
                                                if (i === state.company.deals.length - 1) {
                                                    return (
                                                        <span className='dealLink' key={i}><NavLink exact to={'/affar/' + num._id}>{num.name ? num.name : tc.deal}</NavLink></span>
                                                    );
                                                } else {
                                                    return (
                                                        <span className='dealLink' key={i}><NavLink exact to={'/affar/' + num._id}>{num.name ? num.name : tc.deal}</NavLink>,</span>
                                                    );
                                                }
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                    }
                                </div>
                                }
                            </div>
                        </div>
                        <div className='koncernWrapper__koncern__header__right'>
                            {!changeResponsible &&
                            <div className='koncernWrapper__koncern__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}>
                                    <Icon val='comment' onClick={() => {
                                        setShowComment(true)
                                    }}/>
                                </Tooltip>
                            </div>
                            }
                            {!changeResponsible &&
                            <div className='koncernWrapper__koncern__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addToList}>
                                    <Icon val='list' onClick={() => {setShowSaveToList(true)}}/>
                                </Tooltip>
                            </div>
                            }
                            {!changeResponsible &&
                            <div className='koncernWrapper__koncern__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.createNewDeal}>
                                    <Icon val='add' onClick={() => {setShowCreateDeal(true)}}/>
                                </Tooltip>
                            </div>
                            }
                            {!changeResponsible &&
                            <div className='koncernWrapper__koncern__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.changeOwner}>
                                    <Icon val='edit' onClick={() => {setChangeResponsible(true)}}/>
                                </Tooltip>
                            </div>
                            }
                            {changeResponsible &&
                            <div className='koncernWrapper__koncern__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}>
                                    <Icon val='clear' onClick={() => {
                                        if (state.company.responsible) {
                                            setResponsibleObj(state.company.responsible);
                                        } else {
                                            setResponsibleObj({
                                                responsibleUserId: null,
                                                responsibleUserName: '',
                                            });
                                        }
                                        setChangeResponsible(false)
                                    }}/>
                                </Tooltip>
                            </div>
                            }
                            {changeResponsible &&
                            <div className='koncernWrapper__koncern__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.save}>
                                    <Icon active={true} val='save' onClick={() => {_saveResponsible()}}/>
                                </Tooltip>
                            </div>
                            }
                        </div>
                    </div>
                    <div className='koncernWrapper__koncern__content'>
                        <div className='koncernWrapper__koncern__content__item'>
                            <Events target={id} type='target' view='flow'/>
                        </div>
                        <div className='koncernWrapper__koncern__content__item'>
                            <KoncernInformation/>
                        </div>
                        <div className='koncernWrapper__koncern__content__item'>
                            <KoncernStructure/>
                        </div>
                        <div className='koncernWrapper__koncern__content__item'>
                            <Contacts entityId={id}  entityName={state.company.company.name} entityType='company'/>
                        </div>
                        <div className='koncernWrapper__koncern__content__item'>
                            <Fleet koncern={true} prospectId={id} />
                        </div>
                        <div className='koncernWrapper__koncern__content__item'>
                            <Fleet historic={true} koncern={true} prospectId={id} />
                        </div>
                        <div className='koncernWrapper__koncern__content__item'>
                            <Activities includeComments={true} includeMoved={true} target={id} type='target'/>
                        </div>
                        {showComment &&
                        <Comment
                            close={() => {setShowComment(false)}}
                            headline={tc.oneProspect + ': ' + state.company.company.name}
                            target={id}
                            type='new'
                        />
                        }
                        {showCreateDeal &&
                        <CreateDeal
                            close={async (dealCreated) => {
                                // If deal is created we reload koncern data.
                                if (dealCreated){
                                    setShowCreateDeal(false);
                                    return await getCompany({id: id})
                                } else {
                                    return setShowCreateDeal(false);
                                }
                            }}
                            headline={tc.with + ' ' + tc.connection.toLowerCase() + ' ' + tc.to.toLowerCase() + ' ' + state.company.company.name}
                            koncern={true}
                            prospects={[{id: id, name: state.company.company.name}]}
                            target={id}
                        />
                        }
                        {showSaveToList &&
                        <SaveToList
                            close={() => {setShowSaveToList(false)}}
                            prospects={[id]}
                        />
                        }
                    </div>
                </div>
            </div> :
            <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        company: state.company,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Koncern);

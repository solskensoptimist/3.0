import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {NavLink, useParams} from 'react-router-dom';
import {tc} from 'helpers';
import colors from '../../styles/_colors.scss';
import {RoughNotation} from "react-rough-notation";
import {getPerson, setResponsibility, toggleConsent} from 'store/person/tasks';
import Activities from 'components/activities';
import ColleaguesDropdown from 'components/colleagues_dropdown';
import Comment from 'components/comment';
import CreateDeal from 'components/create_deal';
import Events from 'components/events';
import Fleet from 'components/fleet';
import Icon from 'components/icon';
import Loading from 'components/loading';
import PersonInfo from './person_info';
import SaveToList from 'components/save_to_list';
import Tooltip from 'components/tooltip';

/**
 * Render person view.
 */
const Person = (state) => {
    const {id} = useParams();
    const [changeResponsible, setChangeResponsible] = useState(false);
    const [dataIsCollected, setDataIsCollected] = useState(false);
    const [responsibleObj, setResponsibleObj] = useState({});
    const [showComment, setShowComment] = useState(false);
    const [showCreateDeal, setShowCreateDeal] = useState(false);
    const [showSaveToList, setShowSaveToList] = useState(false);

    const _saveResponsible = async () => {
        setChangeResponsible(false);
        return await setResponsibility({entityId: state.person.person.user_id, responsibleUserId: responsibleObj.responsibleUserId});
    };

    const _stateCheck = () => {
        return !!(dataIsCollected && state && state.person && state.person.person);
    };

    useEffect(() => {
        const getData = async () => {
            await getPerson({id: id});
            // This flag is to prevent sub components to retrieve information for previous person in store.
            setDataIsCollected(true);
        };

        getData();
    }, [id]);

    useEffect(() => {
        if (state.person && state.person.responsible) {
            setResponsibleObj(state.person.responsible);
        } else {
            setResponsibleObj({
                responsibleUserId: null,
                responsibleUserName: '',
            });
        }
    }, [state.person]);

    return (_stateCheck() ?
        <div className='personWrapper'>
            <div className='personWrapper__person'>
                <div className='personWrapper__person__header'>
                    <div className='personWrapper__person__header__left'>
                        <div className='personWrapper__person__header__left__top'>
                            <h4>{tc.privatePerson}</h4>
                            <h3>{state.person.person.name}</h3>
                        </div>
                        <div className='personWrapper__person__header__left__bottom'>
                            <div className='personWrapper__person__header__left__bottom__item'>
                                <h5>{tc.owner}:</h5>
                                {changeResponsible ?
                                    <RoughNotation animationDuration={500} color={colors.informatory} type='underline' show={changeResponsible} strokeWidth={2}>
                                        <ColleaguesDropdown
                                            activeId={responsibleObj.responsibleUserId}
                                            activeName={responsibleObj.responsibleUserName}
                                            transparent={true}
                                            onClick={(id, name) => {
                                                setResponsibleObj({
                                                    ...responsibleObj,
                                                    responsibleUserId: id,
                                                    responsibleUserName: name,
                                                });
                                            }}/>
                                    </RoughNotation> :
                                    <p>{responsibleObj.responsibleUserName ? responsibleObj.responsibleUserName : <span className='italic'>{tc.noOwner}</span>}</p>
                                }
                            </div>
                            {!changeResponsible &&
                                <div className='personWrapper__person__header__left__bottom__item'>
                                    <h5>{tc.gdprConsent}:</h5>
                                    {state.person.person.consent ?
                                        <Tooltip horizontalDirection='right' tooltipContent={tc.gdprConsentInfo}>
                                            <Icon onClick={() => {toggleConsent({id: state.person.person.user_id})}} val='check'/>
                                        </Tooltip> :
                                        <Tooltip horizontalDirection='right' tooltipContent={tc.gdprConsentInfo}>
                                            <Icon onClick={() => {toggleConsent({id: state.person.person.user_id})}} val='checkbox'/>
                                        </Tooltip>
                                    }
                                </div>
                            }
                            {!changeResponsible &&
                                <div className='personWrapper__person__header__left__bottom__item'>
                                    <h5>{tc.partOfDeals}:</h5>
                                    {(state.person.deals && state.person.deals.length) ?
                                        <div className='personWrapper__person__header__left__bottom__item__dealsHolder'>
                                            {state.person.deals.map((num, i) => {
                                                if (num._id) {
                                                    if (i === state.person.deals.length - 1) {
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
                                        </div> : <p><span className='italic'>{tc.noDeals}</span></p>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div className='personWrapper__person__header__right'>
                        {!changeResponsible &&
                        <div className='personWrapper__person__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}>
                                <Icon val='comment' onClick={() => {
                                    setShowComment(true)
                                }}/>
                            </Tooltip>
                        </div>
                        }
                        {!changeResponsible &&
                        <div className='personWrapper__person__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.addToList}>
                                <Icon val='list' onClick={() => {setShowSaveToList(true)}}/>
                            </Tooltip>
                        </div>
                        }
                        {!changeResponsible &&
                        <div className='personWrapper__person__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.createNewDeal}>
                                <Icon val='add' onClick={() => {setShowCreateDeal(true)}}/>
                            </Tooltip>
                        </div>
                        }
                        {!changeResponsible &&
                        <div className='personWrapper__person__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.changeOwner}>
                                <Icon val='edit' onClick={() => {setChangeResponsible(true)}}/>
                            </Tooltip>
                        </div>
                        }
                        {changeResponsible &&
                        <div className='personWrapper__person__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}>
                                <Icon val='clear' onClick={() => {
                                    if (state.person.responsible) {
                                        setResponsibleObj(state.person.responsible);
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
                        <div className='personWrapper__person__header__right__iconHolder'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.save}>
                                <Icon active={true} val='save' onClick={() => {_saveResponsible()}}/>
                            </Tooltip>
                        </div>
                        }
                    </div>
                </div>
                <div className='personWrapper__person__content'>
                    <div className='personWrapper__person__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <PersonInfo/>
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <Fleet prospectId={id} />
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <Fleet historic={true} prospectId={id} />
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <Activities includeComments={true} includeMoved={true} target={id} type='target'/>
                    </div>
                    {showComment &&
                    <Comment
                        close={() => {setShowComment(false)}}
                        headline={tc.oneProspect + ': ' + state.person.person.name}
                        target={id}
                        type='new'
                    />
                    }
                    {showCreateDeal &&
                    <CreateDeal
                        close={async (dealCreated) => {
                            // If deal is created we reload person data.
                            if (dealCreated){
                                setShowCreateDeal(false);
                                return await getPerson({id: id})
                            } else {
                                return setShowCreateDeal(false);
                            }
                        }}
                        headline={tc.with + ' ' + tc.connection.toLowerCase() + ' ' + tc.to.toLowerCase() + ' ' + state.person.person.name}
                        koncern={false}
                        prospects={[{id: id, name: state.person.person.name}]}
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
        <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        person: state.person,
    };
};

export default connect(
    MapStateToProps,
)(Person);

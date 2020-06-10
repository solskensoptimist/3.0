import React, {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCompany, setResponsibility} from 'store/company/tasks';
import {tc} from 'helpers';
import Activities from 'components/activities';
import ColleaguesDropdown from 'components/colleagues_dropdown';
import Comment from 'components/comment';
import CompanyInfo from './company_info';
import Contacts from 'components/contacts';
import CreateDeal from 'components/create_deal';
import Events from 'components/events';
import Fleet from 'components/fleet';
import Loading from 'components/loading';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';

const Company = (state) => {
    const {id} = useParams();
    const [changeResponsible, setChangeResponsible] = useState(false);
    const [dataIsCollected, setDataIsCollected] = useState(false);
    const [responsibleObj, setResponsibleObj] = useState({});
    const [showComment, setShowComment] = useState(false);
    const [showCreateDeal, setShowCreateDeal] = useState(false);

    const _saveResponsible = async () => {
        setChangeResponsible(false);
        return await setResponsibility({entityId: state.company.company.user_id, responsibleUserId: responsibleObj.responsibleUserId});
    };

    const _stateCheck = () => {
        return (dataIsCollected && state && state.company && state.company.responsible && state.company.company && Object.keys(state.company.company).length);
    };

    useEffect(() => {
        const getData = async () => {
            await getCompany({id: id});
            // This flag is to prevent sub components to retrieve information for previous company in store.
            setDataIsCollected(true);
        };

        getData();
    }, [id]);

    useEffect(() => {
        if (state.company.responsible) {
            setResponsibleObj(state.company.responsible);
        } else {
            setResponsibleObj({
                responsibleUserId: null,
                responsibleUserName: '',
            });
        }
    }, [state.company.responsible]);

    return ( _stateCheck() ?
        <div className='companyWrapper'>
            <div className='companyWrapper__company'>
                <div className='companyWrapper__company__header'>
                    <div className='companyWrapper__company__header__top'>
                        <div className='companyWrapper__company__header__top__left'>
                            <h4>{tc.company}</h4>
                            <h3>{state.company.company.name}</h3>
                        </div>
                        <div className='companyWrapper__company__header__top__right'>
                            {!changeResponsible &&
                                <div className='companyWrapper__company__header__top__right__iconHolder'>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}>
                                        <Icon val='comment' onClick={() => {
                                            setShowComment(true)
                                        }}/>
                                    </Tooltip>
                                </div>
                            }
                            {!changeResponsible &&
                                <div className='companyWrapper__company__header__top__right__iconHolder'>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.addToList}>
                                        <Icon val='list' onClick={() => {console.log('spara i lista, ska skötas av tasks/lists')}}/>
                                    </Tooltip>
                                </div>
                            }
                            {!changeResponsible &&
                                <div className='companyWrapper__company__header__top__right__iconHolder'>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.createNewDeal}>
                                        <Icon val='add' onClick={() => {setShowCreateDeal(true)}}/>
                                    </Tooltip>
                                </div>
                            }
                            {!changeResponsible &&
                                <div className='companyWrapper__company__header__top__right__iconHolder'>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.changeOwner}>
                                        <Icon val='edit' onClick={() => {setChangeResponsible(true)}}/>
                                    </Tooltip>
                                </div>
                            }
                            {changeResponsible &&
                                <div className='companyWrapper__company__header__top__right__iconHolder'>
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
                                <div className='companyWrapper__company__header__top__right__iconHolder'>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.save}>
                                        <Icon active={true} val='save' onClick={() => {_saveResponsible()}}/>
                                    </Tooltip>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='companyWrapper__company__header__bottom'>
                        <div className='companyWrapper__company__header__bottom__item'>
                            <h5>{tc.owner}:</h5>
                            {changeResponsible ?
                                <ColleaguesDropdown activeId={responsibleObj.responsibleUserId}
                                    activeName={responsibleObj.responsibleUserName}
                                    onClick={(id, name) => {
                                        setResponsibleObj({
                                            ...responsibleObj,
                                            responsibleUserId: id,
                                            responsibleUserName: name,
                                        });
                                    }}/> :
                                <p>{responsibleObj.responsibleUserName}</p>
                            }
                        </div>
                        <div className='companyWrapper__company__header__bottom__item'>
                            <h5>{tc.partOfDeals}:</h5>
                            {(state.company.deals && state.company.deals.length) &&
                                <div className='companyWrapper__company__header__bottom__item__dealsHolder'>
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
                    </div>
                </div>
                <div className='companyWrapper__company__content'>
                    {showComment && <Comment close={() => {setShowComment(false)}} headline={tc.oneProspect + ': ' + state.company.company.name} target={id} type='new'/>}
                    {showCreateDeal && <CreateDeal close={() => {setShowCreateDeal(false)}} headline={tc.with + ' ' + tc.connection.toLowerCase() + ' ' + tc.to.toLowerCase() + ' ' + state.company.company.name}/>}
                    <div className='companyWrapper__company__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <CompanyInfo/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Contacts entityId={id}  entityName={state.company.company.name} entityType='company'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Fleet prospectId={state.company.company.user_id} />
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Fleet historic={true} prospectId={state.company.company.user_id} />
                    </div>
                    <div className='companyWrapper__company__content__item'>
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
        company: state.company,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Company);

import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCompany, setResponsible} from 'store/company/tasks';
import {tc} from 'helpers';
import Activities from 'components/activities';
import ColleaguesDropdown from 'components/colleagues_dropdown';
import Comment from 'components/comment';
import CompanyInfo from './company_info';
import Contacts from 'components/contacts';
import Events from 'components/events';
import Fleet from 'components/fleet';
import Loading from 'components/loading';
import Icon from 'components/icon';
import Popup from 'components/popup';
import Tooltip from 'components/tooltip';

const Company = (state) => {
    const {id} = useParams();
    const [changeResponsible, setChangeResponsible] = useState(false);
    const [dataIsCollected, setDataIsCollected] = useState(false);
    const [responsibleObj, setResponsibleObj] = useState({});
    const [showComment, setShowComment] = useState(false);

    const _saveResponsible = async () => {
        setChangeResponsible(false);
        return await setResponsible({entityId: state.company.company.user_id, responsibleUserId: responsibleObj.responsibleUserId});
    };

    const _stateCheck = () => {
        return (dataIsCollected && state && state.company && state.company.responsible && state.company.company && Object.keys(state.company.company).length);
    };

    useEffect(() => {
        const getData = async () => {
            await getCompany({id: id});
            // We use this flag to prevent sub components to retrieve information for previous company in store.
            setDataIsCollected(true);
            setResponsibleObj(state.company.responsible);
        };

        getData();
    }, [id, state.company.responsible]);

    return ( _stateCheck() ?
        <div className='companyWrapper'>
            <div className='companyWrapper__company'>
                <div className='companyWrapper__company__header'>
                    <div className='companyWrapper__company__header__left'>
                        <h4>{tc.company}</h4>
                        <h3>{state.company.company.name}</h3>
                        {changeResponsible ?
                            <ColleaguesDropdown activeId={responsibleObj.responsibleUserId} activeName={responsibleObj.responsibleUserName} onClick={(id, name) => {
                                setResponsibleObj({
                                    ...responsibleObj,
                                    responsibleUserId: id,
                                    responsibleUserName: name,
                                });
                            }}/> :
                            <h5>{tc.responsible}: {responsibleObj.responsibleUserName}</h5>
                        }
                    </div>
                    <div className='companyWrapper__company__header__right'>
                        {!changeResponsible &&
                            <div className='companyWrapper__company__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addComment}>
                                    <Icon val='comment' onClick={() => {
                                        setShowComment(true)
                                    }}/>
                                </Tooltip>
                            </div>
                        }
                        {!changeResponsible &&
                            <div className='companyWrapper__company__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addToList}>
                                    <Icon val='list' onClick={() => {console.log('spara i lista, ska skötas av tasks/lists')}}/>
                                </Tooltip>
                            </div>
                        }
                        {!changeResponsible &&
                            <div className='companyWrapper__company__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.createNewDeal}>
                                    <Icon val='add' onClick={() => {console.log('skapa ny affär, ska skötas av deal/tasks')}}/>
                                </Tooltip>
                            </div>
                        }
                        {!changeResponsible &&
                            <div className='companyWrapper__company__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.changeOwner}>
                                    <Icon val='edit' onClick={() => {setChangeResponsible(true)}}/>
                                </Tooltip>
                            </div>
                        }
                        {changeResponsible &&
                            <div className='companyWrapper__company__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}>
                                    <Icon val='clear' onClick={() => {setChangeResponsible(false)}}/>
                                </Tooltip>
                            </div>
                        }
                        {changeResponsible &&
                            <div className='companyWrapper__company__header__right__iconHolder'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.save}>
                                    <Icon active={true} val='save' onClick={() => {_saveResponsible()}}/>
                                </Tooltip>
                            </div>
                        }
                    </div>
                </div>
                <div className='companyWrapper__company__content'>
                    {showComment && <Popup close={() => {setShowComment(false)}} size='small'><Comment close={() => {setShowComment(false)}} target={id} type='new'/></Popup>}
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

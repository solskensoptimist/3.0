import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {activityHelper, dealHelper, personHelper, tc} from 'helpers';
import moment from 'moment';
import {getPreviewData} from 'store/agile/tasks';
import {completeEvent, removeEvent} from 'store/events/tasks';
import history from '../../router_history';
import companyHelper from 'shared_helpers/company_helper';
import ActivityItem from 'components/activities/activity_item';
import Comment from 'components/comment';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from '../tooltip/tooltip';

/**
 * Render preview for a deal or a prospect.
 *
 * No real functionality here, just a lot of divs.
 *
 * @param state.props.id - string/ number - Deal id or prospect id.
 */
const AgilePreview = (state) => {
    const [hideBlocks, setHideBlocks] = useState([]);
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        getPreviewData({
            id: state.props.id,
        });
    }, [state.props.id, state.agile.columns]);

    useEffect(() => {
        setPreviewData(state.agile.previewData);
    }, [state.agile.previewData]);

    const _renderActivitiesBlock = () => {
        return (
            <div className='agilePreviewWrapper__agilePreview__content__block'>
                <div className='agilePreviewWrapper__agilePreview__content__block__header'
                     onClick={() => {
                         if (hideBlocks.includes('activities')) {
                             setHideBlocks(hideBlocks.filter((num) => num !== 'activities'));
                         } else {
                             setHideBlocks(hideBlocks.concat('activities'));
                         }
                     }}
                >
                    <div className='agilePreviewWrapper__agilePreview__content__block__header__title'>
                        {(hideBlocks.includes('activities')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                        <p>{tc.activity}</p>
                    </div>
                </div>
                {(!hideBlocks.includes('activities')) ?
                    <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__activities'>
                            {(previewData.activities && Array.isArray(previewData.activities)) ?
                                previewData.activities.map((activity) => {
                                    // Action
                                    const actionObj = activityHelper.getActionElement(state.props.id, 'target', activity, state.user);
                                    // Comment
                                    const comment = (activity.comment) ? activity.comment : null;

                                    // Date
                                    const date = (activity.date_created) ? moment(new Date(activity.date_created)).format('LL HH:mm') : null;

                                    // Id.
                                    let id;
                                    if (activity._id) {
                                        id = activity._id;
                                    } else if (activity.id) {
                                        id = activity.id;
                                    }

                                    // Icon
                                    let icon;
                                    if (activity.action) {
                                        icon = <Icon val={activity.action}/>;
                                    } else if (!activity.action && activity.comment) {
                                        icon = <Icon val='comment'/>;
                                    }

                                    // User
                                    const user = (activity.user && activity.user !== '') ? activity.user : tc.unknown;

                                    return  <ActivityItem
                                                    action={actionObj.action}
                                                    comment={comment}
                                                    date={date}
                                                    id={id}
                                                    icon={icon}
                                                    isEditable={false}
                                                    standAlone={true}
                                                    user={user}
                                                />;
                                }) : <Loading/>
                            }
                            <Comment target={state.props.id} type='newInline'/>
                        </div>
                    </div> : null
                }
            </div>
        );
    };

    const _renderColleagueDealRows = () => {
        return (
            <>
                {previewData.item.colleagueDeals.map((num, i) => {
                    return (
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row' key={i}>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left'>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left__icon passedDate'>
                                    <Icon val='infoOutlined'/>
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left__content'>
                                    {`${tc.appearsWith} ${tc.colleague.toLowerCase()}`}
                                    <span className='highlight marginLeft marginRight'>{num.name}</span>
                                    {`${tc.with.toLowerCase()} ${tc.phase.toLowerCase()}`}
                                    <span className='highlight marginLeft'>{dealHelper.getReadablePhase(num.phase)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    const _renderEventRows = () => {
        return (
            <>
            {previewData.item.events.map((event) => {
                const diff = moment(event.event_date).diff(new Date(), 'hours');
                let extraClass = false;

                if (diff < (7 * 24) && diff > 24) {
                    extraClass = 'withinOneWeek';
                } else if (diff < 24 && diff >= 0) {
                    extraClass = 'withinOneDay';
                } else if (diff < 0) {
                    extraClass = 'passedDate'
                }

                return (
                    <React.Fragment key={event._id}>
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row'>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left'>
                                <div className={'agilePreviewWrapper__agilePreview__content__block__content__row__left__icon ' + extraClass}>
                                    <Icon val={event.action}/>
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left__content'>
                                    <span className='highlight marginRight'>{tc[event.action]}</span>
                                    {`${moment(new Date(event.event_date)).format(' dddd D MMM HH:mm')}`}
                                    {(event.comment) ?
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row__center__additionalLine'>
                                            <span className='lightAndItalic'>{event.comment}</span>
                                        </div> : null
                                    }
                                </div>
                            </div>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__right'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.completeEvent}>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__row__right__icon'
                                         onClick={async () => {
                                             await completeEvent({eventId: event._id});
                                         }}
                                    >
                                        <Icon val='check'/>
                                    </div>
                                </Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.removeEvent}>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__row__right__icon'
                                         onClick={async () => {
                                             await removeEvent({dealId: previewData.item._id, eventId: event._id});
                                         }}
                                    >
                                        <Icon val='remove'/>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
            </>
        );
    };

    const _renderFleetRows = (prospect) => {
        if (!prospect.fleet || (prospect.fleet && !Object.keys(prospect.fleet).length)) {
            return null;
        }

        let typesArray = [];
        for (const prop in prospect.fleet) {
            typesArray.push(
                <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type' key={prop}>
                    <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type__header'>
                        <span className='listBullet'>&#8226;</span><p>{tc[prop.toLowerCase()]}</p>
                    </div>
                    <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type__content'>
                        {prospect.fleet[prop].map((vehicle, i) => {
                            if (i > 4) {
                                return null;
                            } else {
                                return (
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type__content__vehicle'
                                         key={vehicle.chassi}
                                    >
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type__content__vehicle__left'>
                                            <span className='highlight marginRight'>{vehicle.reg_number}</span><span className='capitalize marginRight'>{`${vehicle.brand.toLowerCase()} (${vehicle.model.toLowerCase()})`}</span>{moment(new Date(vehicle.registration_date)).fromNow()}
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type__content__vehicle__right'
                                             onClick={() => {
                                                 history.push('/bil/' + vehicle.reg_number);
                                             }}
                                        >
                                            <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToCar}>
                                                <Icon val='navigate'/>
                                            </Tooltip>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        {(prospect.fleet[prop].length > 5) ?
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder__type__content__info'>
                                {`...${prospect.fleet[prop].length - 5} ${tc.moreVehicles.toLowerCase()}`}
                            </div> : null
                        }
                    </div>
                </div>
            );
        }

        return (
            <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content__fleetHolder'>
                {typesArray}
            </div>
        );
    };

    const _renderInfoBlock = () => {
        if (previewData.item.type === 'deal') {
            return (
                <div className='agilePreviewWrapper__agilePreview__content__block'>
                    <div className='agilePreviewWrapper__agilePreview__content__block__header'
                         onClick={() => {
                             if (hideBlocks.includes('dealInfo')) {
                                 setHideBlocks(hideBlocks.filter((num) => num !== 'dealInfo'));
                             } else {
                                 setHideBlocks(hideBlocks.concat('dealInfo'));
                             }
                         }}
                    >
                        <div className='agilePreviewWrapper__agilePreview__content__block__header__title'>
                            {(hideBlocks.includes('dealInfo')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                            <p>{tc.deal}</p>
                        </div>
                    </div>
                    {(!hideBlocks.includes('dealInfo')) ?
                        <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                    {tc.owner}:
                                </div>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                    {previewData.item.userName}
                                </div>
                            </div>
                            {(previewData.item.description && previewData.item.description.length) ?
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                        {tc.description}:
                                    </div>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                        {previewData.item.description}
                                    </div>
                                </div> : null
                            }
                            {(previewData.item.potential && previewData.item.potential.length) ?
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                        {tc.potential}:
                                    </div>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                        {previewData.item.potential}
                                    </div>
                                </div> : null
                            }
                            {(previewData.item.listName) ?
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                        {tc.belongsToList}:
                                    </div>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                        {previewData.item.listName}
                                    </div>
                                </div> : null
                            }
                            {(previewData.item.maturity) ?
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                        {tc.maturity}:
                                    </div>
                                    <div
                                        className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                        {dealHelper.getMaturityName(previewData.item.maturity)}
                                    </div>
                                </div> : null
                            }
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                    {tc.phase}:
                                </div>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                    {dealHelper.getReadablePhase(previewData.item.phase)}
                                </div>
                            </div>
                            <div
                                className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                    {tc.created}:
                                </div>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                    {moment(new Date(previewData.item.created)).format('LL HH:mm')}
                                </div>
                            </div>
                            <div
                                className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                    {tc.updated}:
                                </div>
                                <div
                                    className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                    {moment(new Date(previewData.item.updated)).format('LL HH:mm')}
                                </div>
                            </div>
                        </div> : null
                    }
                </div>
            );
        }
    };


    const _renderNotificationsBlock = () => {
        if ((previewData.item.events && previewData.item.events.length) || previewData.item.colleagueDeals || previewData.item.ownActiveDeals) {
            return (
                <div className='agilePreviewWrapper__agilePreview__content__block'>
                    <div className='agilePreviewWrapper__agilePreview__content__block__header'
                         onClick={() => {
                             if (hideBlocks.includes('notifications')) {
                                 setHideBlocks(hideBlocks.filter((num) => num !== 'notifications'));
                             } else {
                                 setHideBlocks(hideBlocks.concat('notifications'));
                             }
                         }}
                    >
                        <div className='agilePreviewWrapper__agilePreview__content__block__header__title'>
                            {(hideBlocks.includes('notifications')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                            <p>{tc.notifications}</p>
                        </div>
                    </div>
                    {(!hideBlocks.includes('notifications')) ?
                        <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                            {(previewData.item.type === 'deal' && previewData.item.events && previewData.item.events.length) ? _renderEventRows() : null}
                            {(previewData.item.colleagueDeals && Array.isArray(previewData.item.colleagueDeals)) ? _renderColleagueDealRows() : null}
                            {(previewData.item.ownActiveDeals && Array.isArray(previewData.item.ownActiveDeals)) ? _renderOwnActiveDealRows() : null}
                        </div> : null
                    }
                </div>
            );
        } else {
            return null;
        }
    };

    const _renderOwnActiveDealRows = () => {
        return (
            <>
                {previewData.item.ownActiveDeals.map((num, i) => {
                    return (
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row' key={i}>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left'>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left__icon'>
                                    <Icon val='list'/>
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left__content'>
                                    {`${tc.appearsIn} ${tc.list.toLowerCase()}`}
                                    <span className='highlight marginLeft marginRight'>{num.listName}</span>
                                    {`${tc.with.toLowerCase()} ${tc.phase.toLowerCase()}`}
                                    <span className='highlight marginLeft'>{dealHelper.getReadablePhase(num.phase)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    const _renderProspectInfoBlock = () => {
        return (
            <div className='agilePreviewWrapper__agilePreview__content__block'>
                <div className='agilePreviewWrapper__agilePreview__content__block__header'
                     onClick={() => {
                         if (hideBlocks.includes('prospectInfo')) {
                             setHideBlocks(hideBlocks.filter((num) => num !== 'prospectInfo'));
                         } else {
                             setHideBlocks(hideBlocks.concat('prospectInfo'));
                         }
                     }}
                >
                    <div className='agilePreviewWrapper__agilePreview__content__block__header__title'>
                        {(hideBlocks.includes('notifications')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                        <p>{tc.prospectInfo}</p>
                    </div>
                </div>
                {(!hideBlocks.includes('prospectInfo')) ?
                    <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                        {(previewData.prospectInformation && Array.isArray(previewData.prospectInformation)) ?
                            previewData.prospectInformation.map((prospect) => {
                                return (
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects' key={prospect.user_id}>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__header'>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__header__left'>
                                                {(prospect.type === 'company') ? <Icon val='company'/> : <Icon val='person'/>}
                                                <h5 className='capitalize'>{prospect.name.toLowerCase()}</h5>
                                            </div>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__header__right'
                                                 onClick={() => {
                                                     if (prospect.type === 'company') {
                                                         history.push('/foretag/' + prospect.user_id);
                                                     } else {
                                                         history.push('/person/' + prospect.user_id);
                                                     }
                                                 }}
                                            >
                                                <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToProspect}>
                                                    <Icon val='navigate'/>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__prospects__content'>
                                            {(previewData.item.type === 'prospect') ?
                                                <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                                        {tc.belongsToList}:
                                                    </div>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                                        {previewData.item.listName}
                                                    </div>
                                                </div> : null
                                            }
                                            {(prospect.type === 'person') ?
                                                <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                                        {tc.age}:
                                                    </div>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                                        {personHelper.getAgeString(prospect.birthYear)}
                                                    </div>
                                                </div> : null
                                            }
                                            {(prospect.address && prospect.zip && prospect.zipMuncipality) ?
                                                <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                                        {tc.address}:
                                                    </div>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right capitalize'>
                                                        {`${prospect.address.toLowerCase()}, ${prospect.zip},  ${prospect.zipMuncipality.toLowerCase()}`}
                                                    </div>
                                                </div> : null
                                            }
                                            {(prospect.phoneNumbers && Array.isArray(prospect.phoneNumbers) && prospect.phoneNumbers.length) ?
                                                <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                                        {tc.phoneNumber}:
                                                    </div>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                                        {prospect.phoneNumbers.map((num, i) => {
                                                            if (i === prospect.phoneNumbers.length - 1) {
                                                                return <span key={num.id}>{num.value}</span>;
                                                            } else {
                                                                return <span key={num.id}>{num.value}, </span>;
                                                            }
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {(prospect.emails && Array.isArray(prospect.emails) && prospect.emails.length) ?
                                                <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow'>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__left'>
                                                        {tc.email}:
                                                    </div>
                                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__halfRow__right'>
                                                        {prospect.emails.map((num, i) => {
                                                            if (i === prospect.emails.length - 1) {
                                                                return <span key={num.id}>{num.value}</span>;
                                                            } else {
                                                                return <span key={num.id}>{num.value}, </span>;
                                                            }
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {_renderFleetRows(prospect)}
                                        </div>
                                    </div>
                                );
                            }) : <Loading/>
                        }
                    </div> : null
                }
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(previewData && previewData.item);
    };

    return ( _stateCheck() ?
            <div className='agilePreviewWrapper'>
                <div className='agilePreviewWrapper__agilePreview'>
                    <div className='agilePreviewWrapper__agilePreview__header'>
                        <div className='agilePreviewWrapper__agilePreview__header__main'
                            onClick={() => {
                                if (previewData.item.type === 'deal') {
                                    history.push('/affar/' + state.props.id);
                                } else if (companyHelper.isValidOrgNr(state.props.id)) {
                                    history.push('/foretag/' + state.props.id);
                                } else {
                                    history.push('/person/' + state.props.id);
                                }
                            }}
                         >
                            {previewData.item.name}
                            <div className='agilePreviewWrapper__agilePreview__header__main__navigate'>
                                <Icon val='navigate'/>
                            </div>
                        </div>
                        <div className='agilePreviewWrapper__agilePreview__header__sub'>
                            <div className='agilePreviewWrapper__agilePreview__header__sub__sub'>
                                <Icon val='agile'/>
                            </div>
                        </div>
                    </div>
                    <div className='agilePreviewWrapper__agilePreview__content'>
                        {_renderNotificationsBlock()}
                        {_renderInfoBlock()}
                        {_renderProspectInfoBlock()}
                        {_renderActivitiesBlock()}
                    </div>
                </div>
            </div> :
            <Loading/>
    );
};


const MapStateToProps = (state, props) => {
    return {
        agile: state.agile,
        props: props,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(AgilePreview);

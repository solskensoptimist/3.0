import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {dealHelper, tc} from 'helpers';
import moment from 'moment';
import {completeEvent, removeEvent} from 'store/events/tasks';
import history from '../../router_history';
import companyHelper from 'shared_helpers/company_helper';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from '../tooltip/tooltip';

const AgilePreview = (state) => {
    const [item, setItem] = useState(null);
    const [type, setType] = useState('');

    useEffect(() => {
        if (state.props.id && state.agile.columns && Array.isArray(state.agile.columns)) {
            let found;
            state.agile.columns.forEach((column) => {
                if (column.id === 'prospects' && column.items.find((num) => num.prospectId === state.props.id)) {
                     found = column.items.find((num) => num.prospectId === state.props.id);
                } else if (column.items.find((num) => num._id === state.props.id)) {
                    found = column.items.find((num) => num._id === state.props.id);
                }
            });

            if (found) {
                setItem(found);
                setType((found._id ? 'deal' : 'prospect'))
            }
        }
    }, [state.agile.columns, state.props.id]);

    const _renderEvents = () => {
        return (
            <div className='agilePreviewWrapper__agilePreview__content__section'>
                <h5>{tc.events}</h5>
                {item.events.map((event) => {
                    const diff = moment(event.event_date).diff(new Date(), 'hours');
                    let extraClass;

                    if (diff < (7 * 24) && diff > 24) {
                        extraClass = 'withinOneWeek';
                    } else if (diff < 24 && diff >= 0) {
                        extraClass = 'withinOneDay';
                    } else if (diff < 0) {
                        extraClass = 'passedDate'
                    }

                    return (
                        <div className='agilePreviewWrapper__agilePreview__content__section__item' key={event._id}>
                            <div className='agilePreviewWrapper__agilePreview__content__section__item__left'>
                                <div className={'agilePreviewWrapper__agilePreview__content__section__item__left__icon ' + extraClass}>
                                    <Icon val={event.action}/>
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__highlight previewMarginRight'>{tc[event.action]}</div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__capitalize'>
                                    {moment(new Date(event.event_date)).format(' dddd D MMM hh:mm')}
                                </div>
                            </div>
                            <div className='agilePreviewWrapper__agilePreview__content__section__item__right'>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__right__icon'
                                     onClick={async () => {
                                         await completeEvent({eventId: event._id});
                                     }}
                                >
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.completeEvent}>
                                        <Icon val='check'/>
                                    </Tooltip>
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__right__icon'
                                     onClick={async () => {
                                         await removeEvent({dealId: item._id, eventId: event._id});
                                     }}
                                >
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.removeEvent}>
                                        <Icon val='remove'/>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const _renderOwnActiveDeals = () => {
        return (
            <div className='agilePreviewWrapper__agilePreview__content__section'>
                <h5>{tc.prospectInOtherOwnLists}</h5>
                {item.ownActiveDeals.map((num, i) => {
                    return (
                        <div className='agilePreviewWrapper__agilePreview__content__section__item' key={i}>
                            <div className='agilePreviewWrapper__agilePreview__content__section__item__left'>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__icon'>
                                    <Icon val='agile'/>
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__text previewMarginRight'>
                                    {tc.list}:
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__highlight previewMarginRight'>
                                    {num.listName}.
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__text previewMarginRight'>
                                    {tc.phase}:
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__section__item__left__highlight'>
                                    {dealHelper.getReadablePhase(num.phase)}.
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(item && type.length);
    };

    /*
    ownActiveDeals, colleagueActivity.
    Information
    Vagnpark
    Kommentarsmöjlighet
    Aktivitet / Aktivitet med endast kommentarer?
     */

    return ( _stateCheck() ?
            <div className='agilePreviewWrapper'>
                <div className='agilePreviewWrapper__agilePreview'>
                    <div className='agilePreviewWrapper__agilePreview__header'>
                        <div className='agilePreviewWrapper__agilePreview__header__main'
                            onClick={() => {
                                if (type === 'deal') {
                                    history.push('/affar/' + state.props.id);
                                } else if (companyHelper.isValidOrgNr(state.props.id)) {
                                    history.push('/foretag/' + state.props.id);
                                } else {
                                    history.push('/person/' + state.props.id);
                                }
                            }}
                         >
                            {item.name}
                        </div>
                        <div className='agilePreviewWrapper__agilePreview__header__sub'>
                            <div className='agilePreviewWrapper__agilePreview__header__sub__sub'>
                                <Icon val='agile'/>
                            </div>
                        </div>
                    </div>
                    <div className='agilePreviewWrapper__agilePreview__content'>
                        {(type === 'deal' && item.events && item.events.length) ? _renderEvents() : null}
                        {(type === 'deal' && item.ownActiveDeals) ? _renderOwnActiveDeals() : null}
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
    };
};

export default connect(
    MapStateToProps,
)(AgilePreview);

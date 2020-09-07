import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {tc} from 'helpers';
import {setPreviewItem} from 'store/agile/tasks';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';

/**
 * Render an item for kanban board.
 * Different rendering for deal/prospects.
 */
export default (props) => {
    const [showActions, setShowActions] = useState(false);
    const {addActivity, item, provided, snapshot} = props;

    const _addActivity = (e) => {
        e.stopPropagation();
        addActivity(item._id);
    };

    const _markDealAsLost = () => {
        console.log('LOST');
        // Ha check på att det inte är ett prospekt
    };

    const _markDealAsWon = () => {
        console.log('WON');
        // Ha check på att det inte är ett prospekt
    };

    const _openItem = (e) => {
        e.stopPropagation();
        setPreviewItem(item._id ? item._id : item.prospectId);
    };

    /**
     * Render event reminder icon based on events.
     * If no events scheduled, render a default 'add event' icon.
     */
    const _renderEvent = () => {
        let element = null;

        if (item.events && item.events.length) {
            let date = null;
            item.events.forEach((event) => {
                if (!date && event.event_date) {
                    date = new Date(event.event_date);
                } else if (event.event_date && new Date(event.event_date) < date) {
                    date = new Date(event.event_date);
                }
            });

            if (date) {
                const diff = moment(date).diff(new Date(), 'hours');
                let addActivity = (
                    <div className='itemWrapper__item__content__event__defaultHidden'>
                        <Tooltip horizontalDirection='right' tooltipContent={tc.addActivity}>
                            <Icon val='add' onClick={_addActivity}/>
                        </Tooltip>
                    </div>
                );

                if (diff < (7 * 24) && diff > 24) {
                    element = (
                        <div className='itemWrapper__item__content__event'>
                            {addActivity}
                            <div className='itemWrapper__item__content__event__withinOneWeek'>
                                <Icon val='time'/>
                            </div>
                        </div>
                    );
                } else if (diff < 24 && diff >= 0) {
                    element = (
                        <div className='itemWrapper__item__content__event'>
                            {addActivity}
                            <div className='itemWrapper__item__content__event__withinOneDay'>
                                <Icon val='time'/>
                            </div>
                        </div>
                    );
                } else if (diff < 0) {
                    element = (
                        <div className='itemWrapper__item__content__event'>
                            {addActivity}
                            <div className='itemWrapper__item__content__event__passed'>
                                <Icon val='time'/>
                            </div>
                        </div>
                    );
                }
            }
        }

        if (!element) {
            element = (
                <div className='itemWrapper__item__content__event'>
                    <div className='itemWrapper__item__content__event__defaultVisible'>
                        <Tooltip horizontalDirection='right'tooltipContent={tc.addActivity}>
                            <Icon val='add' onClick={_addActivity}/>
                        </Tooltip>
                    </div>
                </div>
            );
        }

        return element;
    };

    const _renderDealItem = () => {
        return (
            <div className='itemWrapper__item'>
                <div className='itemWrapper__item__content' onClick={_openItem}>
                    {_renderEvent()}
                    <div className='itemWrapper__item__content__main'>
                        <div className='itemWrapper__item__content__main__mainTop'>
                            <div className='itemWrapper__item__content__main__mainTop__dealName'>
                                {item.name}
                                {_renderInformationHolder()}
                            </div>
                        </div>
                        {item.updated ?
                            <div className='itemWrapper__item__content__main__mainBottom'>
                                <span className='itemWrapper__item__content__main__mainBottom__label'>
                                    {tc.updated}:
                                </span>
                                <span className='itemWrapper__item__content__main__mainBottom__value'>
                                    {moment(new Date(item.updated)).fromNow()}
                                </span>
                            </div> : null
                        }
                    </div>
                    <div className='itemWrapper__item__content__toggleActions'>
                        {(showActions) ?
                            <Icon val='upArrowRounded' onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(false);
                            }}/>:
                            <Icon val='downArrowRounded' onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(true);
                            }}/>
                        }
                    </div>
                </div>
                <div className={(showActions) ?
                        'itemWrapper__item__bottom' :
                        'itemWrapper__item__hidden'}
                >
                    <div className='itemWrapper__item__bottom__lost' onClick={_markDealAsLost}>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.moveDealToLost}>
                            <Icon val='lost'/>
                        </Tooltip>
                    </div>
                    <div className='itemWrapper__item__bottom__won' onClick={_markDealAsWon}>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.moveDealToWon}>
                            <Icon val='won'/>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    };

    const _renderInformationHolder = () => {
        if (!item.ownActiveDeals && !item.colleagueDeals) {
            return null;
        } else if (item.ownActiveDeals && item.colleagueDeals) {
            return (
                <div className='itemWrapper__item__content__main__mainTop__informationHolder__red'>
                    <Icon val='infoOutlined'/>
                </div>
            );
        } else if (item.ownActiveDeals && !item.colleagueDeals) {
            return (
                <div className='itemWrapper__item__content__main__mainTop__informationHolder'>
                    <Icon val='infoOutlined'/>
                </div>
            );
        } else if (!item.ownActiveDeals && item.colleagueDeals) {
            return (
                <div className='itemWrapper__item__content__main__mainTop__informationHolder__red'>
                    <Icon val='infoOutlined'/>
                </div>
            );
        }
    };

    const _renderProspectItem = () => {
        return (
            <div className='itemWrapper__item'>
                <div className='itemWrapper__item__content' onClick={_openItem}>
                    <div className='itemWrapper__item__content__user'>
                        <Icon val='user'/>
                    </div>
                    <div className='itemWrapper__item__content__main'>
                        <div className='itemWrapper__item__content__main__mainTop'>
                            <div className='itemWrapper__item__content__main__mainTop__prospectName'>
                                {item.name}
                                {_renderInformationHolder()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={(snapshot.isDragging) ?
                'itemWrapper isDragging' :
                'itemWrapper'}
             ref={provided.innerRef}
             key={item._id ? item._id : item.prospectId}
             {...provided.draggableProps}
             {...provided.dragHandleProps}
        >
            {item._id ? _renderDealItem() : _renderProspectItem()}
        </div>
    );
};

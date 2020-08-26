import React from 'react';
import moment from 'moment';
import {tc} from 'helpers';
import Icon from 'components/icon';
// import ItemMenu from '../item_menu';
import Tooltip from 'components/tooltip';

export default (props) => {
    const {item, addActivity, openItem, provided, snapshot} = props;

    const _addActivity = (e) => {
        e.stopPropagation();
        addActivity(item._id);
    };

    const _openItem = (e) => {
        e.stopPropagation();
        openItem(item._id);
    };

    const _openMenu = (e) => {
        e.stopPropagation();
        console.log('Öppna meny för', item._id);
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

                if (diff < (7 * 24) && diff > 24) {
                    element = (
                        <div className='itemWrapper__item__content__event'>
                            <div className='itemWrapper__item__content__event__defaultHidden'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addAgileActivity}>
                                    <Icon val='add' onClick={_addActivity}/>
                                </Tooltip>
                            </div>
                            <div className='itemWrapper__item__content__event__withinOneWeek'>
                                <Icon val='time'/>
                            </div>
                        </div>
                    );
                } else if (diff < 24 && diff >= 0) {
                    element = (
                        <div className='itemWrapper__item__content__event'>
                            <div className='itemWrapper__item__content__event__defaultHidden'>
                                <Icon val='add' onClick={_addActivity}/>
                            </div>
                            <div className='itemWrapper__item__content__event__withinOneDay'>
                                <Icon val='time'/>
                            </div>
                        </div>
                    );
                } else if (diff < 0) {
                    element = (
                        <div className='itemWrapper__item__content__event'>
                            <div className='itemWrapper__item__content__event__defaultHidden'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addAgileActivity}>
                                    <Icon val='add' onClick={_addActivity}/>
                                </Tooltip>
                            </div>
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
                        <Tooltip horizontalDirection='left' tooltipContent={tc.addAgileActivity}>
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
            <div className='itemWrapper__item' onClick={_openItem}>
                <div className='itemWrapper__item__content'>
                    {_renderEvent()}
                    <div className='itemWrapper__item__content__main'>
                        <div className='itemWrapper__item__content__main__top'>
                            <div className='itemWrapper__item__content__main__top__title'>
                                {item.name}
                            </div>
                            <div className='itemWrapper__item__content__main__top__menu'>
                                <Icon val='dotsVert' onClick={_openMenu}/>
                            </div>
                        </div>
                        <div className='itemWrapper__item__content__main__bottom'>
                            {item.updated ?
                                <div className='itemWrapper__item__content__main__bottom__updated'>
                                    <span className='itemWrapper__item__content__main__bottom__updated__label'>
                                        {tc.updated}:
                                    </span>
                                            <span className='itemWrapper__item__content__main__bottom__updated__value'>
                                        {moment(new Date(item.updated)).fromNow()}
                                    </span>
                                </div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const _renderProspectItem = () => {
        return (
            <div className='itemWrapper__item' onClick={_openItem}>
                <div className='itemWrapper__item__content'>
                    <div className='itemWrapper__item__content__user'>
                        <Icon val='user'/>
                    </div>
                    <div className='itemWrapper__item__content__main'>
                        {item.name}
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

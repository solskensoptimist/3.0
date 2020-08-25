import React from 'react';
import moment from 'moment';
import {tc} from 'helpers';
import Icon from 'components/icon';
// import ItemMenu from '../item_menu';

export default (props) => {
    const {item, addActivity, openItem, openMenu, provided, snapshot} = props;

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
        openMenu(item._id);
    };

    const _renderDealItem = () => {
        return (
            <div className='itemWrapper__item' onClick={_openItem}>
                <div className='itemWrapper__item__content'>
                    <div className='itemWrapper__item__content__activity'>
                        <Icon val='add' onClick={_addActivity}/>
                    </div>
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
                <div className='itemWrapper__item__header'>
                    {item.name}
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

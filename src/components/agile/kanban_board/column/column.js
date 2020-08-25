import React from 'react';
import {tc} from 'helpers';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import Icon from 'components/icon';
import ItemsList from '../items_list';

export default (props) => {
    const {addActivity, column, index, items, openItem, openMenu, title, total} = props;

    return (
        <Draggable draggableId={title} index={index}>
            {(provided, snapshot) => (
                <div className={(snapshot.isDragging) ?
                        'columnWrapper isDragging' :
                        'columnWrapper'}
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                >
                    <div className='columnWrapper__column'>
                        <div className='columnWrapper__column__header'>
                            <div className='columnWrapper__column__header__title'>
                                <Icon val='dragIndicator'/>{title}
                            </div>
                            <div className='columnWrapper__column__header__total'>
                                {total} {tc.aPiece.toLowerCase()}
                            </div>
                        </div>
                        <div className='columnWrapper__column__content'>
                            <Droppable droppableId={column.id} type='item'>
                                {(provided, snapshot) => (
                                    <ItemsList
                                        addActivity={addActivity}
                                        isDraggingOver={snapshot.isDraggingOver}
                                        items={items}
                                        openItem={openItem}
                                        openMenu={openMenu}
                                        provided={provided}
                                    />
                                )}
                            </Droppable>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

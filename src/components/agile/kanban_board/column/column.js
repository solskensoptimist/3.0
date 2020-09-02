import React from 'react';
import {tc} from 'helpers';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import Icon from 'components/icon';
import ItemsList from '../items_list';
import Tooltip from 'components/tooltip';

export default (props) => {
    const {addActivity, column, index, items, openItem, removeColumn, title, total} = props;

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
                            {(column.id !== 'prospects') ?
                                <>
                                    <div className='columnWrapper__column__header__totalHideOnHover'>
                                        {total} {tc.aPiece.toLowerCase()}
                                    </div>
                                    <Tooltip horizontalDirection='left' verticalDirection='bottom' tooltipContent={tc.removeColumn}>
                                        <div className='columnWrapper__column__header__remove'
                                             onClick={(e) => {
                                                 e.stopPropagation();
                                                 removeColumn(column.id);
                                             }}
                                        >
                                            <Icon val='remove'/>
                                        </div>
                                    </Tooltip>
                                </> :
                                <div className='columnWrapper__column__header__total'>
                                    {total} {tc.aPiece.toLowerCase()}
                                </div>
                            }
                        </div>
                        <div className='columnWrapper__column__content'>
                            <Droppable droppableId={column.id} type='item'>
                                {(provided) => (
                                    <ItemsList
                                        addActivity={addActivity}
                                        columnIndex={index}
                                        items={items}
                                        openItem={openItem}
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

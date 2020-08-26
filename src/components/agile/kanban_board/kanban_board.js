import React, {useEffect, useState} from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {tc} from 'helpers';
import Column from './column';

/**
 * Component that renders a kanban board with draggable items and columns.
 * Data and functions is handled through props.
 */
export default (props) => {
    const [showFooter, setShowFooter] = useState(false);
    const {addActivity, columns, dragEnd, isDragging, openItem} = props;

    useEffect(() => {
        console.log('ISDRAGGING PROPS', isDragging);
        if (isDragging) {
            setShowFooter(true);
        } else {
            setShowFooter(false);
        }
    }, [isDragging]);

    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanBoard'>
                <DragDropContext
                    onDragEnd={(el) => {
                        setShowFooter(false);
                        dragEnd(el);
                    }}
                    onDragStart={() => {
                        setShowFooter(true);
                    }}
                >
                    <div className='kanbanBoardWrapper__kanbanBoard__content'>
                        <Droppable
                            droppableId='board'
                            type='column'
                            direction='horizontal'
                        >
                            {(provided) => (
                                <div className='kanbanBoardWrapper__kanbanBoard__content__container'
                                     ref={provided.innerRef}
                                     {...provided.droppableProps}
                                >
                                    {columns.map((column, index) => (
                                        <Column
                                            addActivity={addActivity}
                                            column={column}
                                            key={column.title}
                                            index={index}
                                            openItem={openItem}
                                            items={column.items}
                                            title={column.title}
                                            total={column.items.length}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className={showFooter ?
                            'kanbanBoardWrapper__kanbanBoard__footer' :
                            'kanbanBoardWrapper__kanbanBoard__hidden'}
                    >
                        <Droppable
                            droppableId='lost'
                            type='action'
                        >
                            {(provided) => (
                                <div className='kanbanBoardWrapper__kanbanBoard__footer__lost'
                                     ref={provided.innerRef}
                                     {...provided.droppableProps}
                                >{tc.lost}</div>
                            )}
                        </Droppable>
                        <Droppable
                            droppableId='won'
                            type='action'
                        >
                            {(provided) => (
                                <div className='kanbanBoardWrapper__kanbanBoard__footer__won'
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >{tc.won}</div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

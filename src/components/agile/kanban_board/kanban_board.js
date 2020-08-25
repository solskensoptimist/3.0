import React from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {tc} from 'helpers';
import Column from './column';


/**
 * Component that renders a kanban board with draggable items and columns.
 * Data and functions is handled through props.
 */
export default (props) => {
    const {addActivity, columns, dragEnd, openItem} = props;

    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanBoard'>
                <DragDropContext onDragEnd={dragEnd}>
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
                    <div className='kanbanBoardWrapper__kanbanBoard__footer'>
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

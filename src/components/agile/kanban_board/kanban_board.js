import React from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import KanbanBoardColumn from './kanban_board_column';
import KanbanBoardItem from './kanban_board_item';
// import KanbanBoardItemMenu from './kanban_board_item_menu';


/**
 * Component that renders a kanban board with draggable items and columns.
 * Data and functions is handled through props.
 */
export default (props) => {
    const {addActivity, columns, dragEnd, openItem, openMenu} = props;

    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanBoard'>
                <div className='kanbanBoardWrapper__kanbanBoard__content'>
                    <DragDropContext onDragEnd={dragEnd}>
                        {columns.map((column) => (
                            <div className='kanbanBoardWrapper__kanbanBoard__content__column' key={column.id}>
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <KanbanBoardColumn
                                            provided={provided}
                                            snapshot={snapshot}
                                            title={column.title}
                                            total={column.items.length}
                                        >
                                            {column.items.map((item, index) => (
                                                <Draggable
                                                    draggableId={item._id ? item._id : item.prospectId.toString()}
                                                    index={index}
                                                    key={item._id ? item._id : item.prospectId.toString()}
                                                >
                                                    {(provided, snapshot) => (
                                                        <KanbanBoardItem
                                                            addActivity={addActivity}
                                                            openItem={openItem}
                                                            openMenu={openMenu}
                                                            provided={provided}
                                                            snapshot={snapshot}
                                                            item={item}
                                                        />
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </KanbanBoardColumn>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
                {/*<KanbanBoardItemMenu*/}
                {/*    onClose={_handleItemClose}*/}
                {/*    open={Boolean(openedItem)}*/}
                {/*    item={openedItem}*/}
                {/*/>*/}
            </div>
        </div>
    );
};

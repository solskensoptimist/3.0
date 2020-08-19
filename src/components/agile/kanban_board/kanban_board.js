import React, {useState}  from 'react';
// import {tc} from 'helpers';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuid from 'uuid/v1';
import KanbanBoardItem from './kanban_board_item';
import KanbanBoardItemMenu from './kanban_board_item_menu';
import KanbanBoardList from './kanban_board_list';


export default (props) => {
    const [lists, setLists] = useState(props.lists);
    const [openedTask, setOpenedTask] = useState(null);

    console.log('lists', lists);

    const handleDragEnd = (event) => {
        if (!event.destination) {
            return;
        }

        const newLists = JSON.parse(JSON.stringify(lists)); // Clone lists.
        const sourceList = newLists.find(list => list.id === event.source.droppableId);
        const destinationList = newLists.find(list => list.id === event.destination.droppableId);
        const [removedItem] = sourceList.items.splice(event.source.index, 1);

        if (event.source.droppableId === event.destination.droppableId) {
            sourceList.items.splice(event.destination.index, 0, removedItem);
            setLists(newLists);
        } else {
            removedItem.list = event.destination.droppableId;
            destinationList.items.splice(event.destination.index, 0, removedItem);
            setLists(newLists);
        }
    };

    const handleListAdd = () => {
        const list = {
            id: uuid(),
            title: 'New list',
            items: [],
        };

        setLists(lists.concat([list]));
    };

    const handleTaskOpen = (task) => {
        setOpenedTask(task);
    };

    const handleTaskClose = () => {
        setOpenedTask(null);
    };

    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanboard'>
                <div className='kanbanBoardWrapper__kanbanboard__header'>
                    <button onClick={handleListAdd}>Lägg till lista</button>
                </div>
                <div className='kanbanBoardWrapper__kanbanboard__content'>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {lists.map(list => (
                            <Droppable
                                droppableId={list.id}
                                key={list.id}
                            >
                                {(provided, snapshot) => (
                                    <KanbanBoardList
                                        provided={provided}
                                        snapshot={snapshot}
                                        title={list.title}
                                        total={list.items.length}
                                    >
                                        {list.items.map((task, index) => (
                                            <Draggable
                                                draggableId={task.id}
                                                index={index}
                                                key={task.id}
                                            >
                                                {(provided, snapshot) => (
                                                    <KanbanBoardItem
                                                        onOpen={() => handleTaskOpen(task)}
                                                        provided={provided}
                                                        snapshot={snapshot}
                                                        task={task}
                                                    />
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </KanbanBoardList>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                </div>
                <KanbanBoardItemMenu
                    onClose={handleTaskClose}
                    open={Boolean(openedTask)}
                    task={openedTask}
                />
            </div>
        </div>
    );
};

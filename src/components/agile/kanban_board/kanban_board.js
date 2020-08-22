import React, {useEffect, useState}  from 'react';
// import {tc} from 'helpers';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuid from 'uuid/v1';
import KanbanBoardColumn from './kanban_board_column';
import KanbanBoardItem from './kanban_board_item';
import KanbanBoardItemMenu from './kanban_board_item_menu';
import {connect} from "react-redux";
import {tc} from "helpers";


/**
 * Component that renders a kanban board with draggable deal items wtih connection to agile reducer.
 */
const KanbanBoard = (state) => {
    const [columns, setColumns] = useState([]);
    const [openedItem, setOpenedItem] = useState(null);

    useEffect(() => {
        // Ska såklart hämtas från db....
        const userColumns = [
            {
                id: tc.prospects,
                title: tc.prospects
            },
            {
                id: 'todo',
                title: 'Todo'
            },
            {
                id: 'contacted',
                title: 'Contacted'
            },
            {
                id: 'negotiation',
                title: 'Negotiation'
            }
        ];

        const columnsMapped = [];

        // Add items array.
        for (const column of userColumns) {
            columnsMapped.push({ ...column, items: []});
        }

        if (state.agile.data) {
            // If deals, push to correct column items array.
            if (state.agile.data.deals && state.agile.data.deals.length) {
                state.agile.data.deals.forEach((deal) => {
                    const col = columnsMapped.find((column) => column.id === deal.phase);
                    if (col) {
                        col.items.push(deal);
                    }
                });
            }

            // If prospects, push to 'prospects' column items array.
            if (state.agile.data.prospects && state.agile.data.prospects.length) {
                state.agile.data.prospects.forEach((deal) => {
                    const col = columnsMapped.find((column) => column.id === 'prospects');
                    if (col) {
                        col.items.push(deal);
                    }
                });
            }
        }
        setColumns(columnsMapped);
    }, [state.agile.data]);

    const handleDragEnd = (event) => {
        console.log('event i handeDragEnd', event);
        // Här ska ske ett backend call där vi ändrar phase på en affär/prospekt.
        // Eller ska backend callet också ligga i agile kanske, så vi kör typ props.updatePhase eller så....?
        // Sen ska vi i <Agile> lyssna på store.agile.data (eller så) och utifrån det skicka in nya props.
        // I denna komponent ska vi lyssna på props, och sen sätta nytt state.

        if (!event.destination) {
            return;
        }

        const newColumns = JSON.parse(JSON.stringify(columns)); // Clone lists.
        const sourceColumn = newColumns.find(column => column.id === event.source.droppableId);
        const destinationColumn = newColumns.find(column => column.id === event.destination.droppableId);
        const [removedItem] = sourceColumn.items.splice(event.source.index, 1);

        if (event.source.droppableId === event.destination.droppableId) {
            sourceColumn.items.splice(event.destination.index, 0, removedItem);
            setColumns(newColumns);
        } else {
            removedItem.column = event.destination.droppableId;
            destinationColumn.items.splice(event.destination.index, 0, removedItem);
            setColumns(newColumns);
        }
    };

    const handleColumnAdd = () => {
        // Här ska ske ett backend call, eller ska backend callet ligga i agile via props.addColumne eller så..?
        // ...och i agile lyssnar vi på store.agile.columns och skickar nya props.
        // I denna komponent ska vi bara lyssna på props och sätta nya columns utifrån det.

        const column = {
            id: uuid(),
            title: 'New column', // Hämta namn från input ref....
            items: [],
        };

        setColumns(columns.concat([column]));
    };

    console.log('columns i KanbanBoard', columns);

    const handleItemOpen = (item) => {
        setOpenedItem(item);
    };

    const handleItemClose = () => {
        setOpenedItem(null);
    };

    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanBoard'>
                <div className='kanbanBoardWrapper__kanbanBoard__header'>
                    <button onClick={handleColumnAdd}>Lägg till kolumn</button>
                </div>
                <div className='kanbanBoardWrapper__kanbanBoard__content'>
                    <DragDropContext onDragEnd={handleDragEnd}>
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
                                                    draggableId={item._id ? item._id : item.user_id}
                                                    index={index}
                                                    key={item._id ? item._id : item.user_id}
                                                >
                                                    {(provided, snapshot) => (
                                                        <KanbanBoardItem
                                                            onOpen={() => handleItemOpen(item)}
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
                <KanbanBoardItemMenu
                    onClose={handleItemClose}
                    open={Boolean(openedItem)}
                    item={openedItem}
                />
            </div>
        </div>
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
)(KanbanBoard);

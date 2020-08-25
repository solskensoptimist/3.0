import React from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './column';


/**
 * Component that renders a kanban board with draggable items and columns.
 * Data and functions is handled through props.
 */
export default (props) => {
    const {addActivity, columns, dragEnd, openItem, openMenu} = props;

    // render() {
    //     const columns: QuoteMap = this.state.columns;
    //     const ordered: string[] = this.state.ordered;
    //     const {
    //         containerHeight,
    //         useClone,
    //         isCombineEnabled,
    //         withScrollableColumns,
    //     } = this.props;
    //
    //     const board = (
    //         <Droppable
    //             droppableId="board"
    //             type="COLUMN"
    //             direction="horizontal"
    //             ignoreContainerClipping={Boolean(containerHeight)}
    //             isCombineEnabled={isCombineEnabled}
    //         >
    //             {(provided: DroppableProvided) => (
    //                 <Container ref={provided.innerRef} {...provided.droppableProps}>
    //                     {ordered.map((key: string, index: number) => (
    //                         <Column
    //                             key={key}
    //                             index={index}
    //                             title={key}
    //                             quotes={columns[key]}
    //                             isScrollable={withScrollableColumns}
    //                             isCombineEnabled={isCombineEnabled}
    //                             useClone={useClone}
    //                         />
    //                     ))}
    //                     {provided.placeholder}
    //                 </Container>
    //             )}
    //         </Droppable>
    //     );


    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanBoard'>
                <div className='kanbanBoardWrapper__kanbanBoard__content'>
                    <DragDropContext onDragEnd={dragEnd}>
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
                                            openMenu={openMenu}
                                            items={column.items}
                                            title={column.title}
                                            total={column.items.length}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        {/*{columns.map((column) => (*/}
                        {/*    <div className='kanbanBoardWrapper__kanbanBoard__content__column' key={column.id}>*/}
                        {/*        <Droppable droppableId={column.id} type='item' id='column' direction='vertical'>*/}
                        {/*            {(provided, snapshot) => (*/}
                        {/*                <KanbanBoardColumn*/}
                        {/*                    provided={provided}*/}
                        {/*                    snapshot={snapshot}*/}
                        {/*                    title={column.title}*/}
                        {/*                    total={column.items.length}*/}
                        {/*                >*/}
                        {/*                    {column.items.map((item, index) => (*/}
                        {/*                        <Draggable*/}
                        {/*                            draggableId={item._id ? item._id : item.prospectId.toString()}*/}
                        {/*                            index={index}*/}
                        {/*                            key={item._id ? item._id : item.prospectId.toString()}*/}
                        {/*                        >*/}
                        {/*                            {(provided, snapshot) => (*/}
                        {/*                                <KanbanBoardItem*/}
                        {/*                                    addActivity={addActivity}*/}
                        {/*                                    openItem={openItem}*/}
                        {/*                                    openMenu={openMenu}*/}
                        {/*                                    provided={provided}*/}
                        {/*                                    snapshot={snapshot}*/}
                        {/*                                    item={item}*/}
                        {/*                                />*/}
                        {/*                            )}*/}
                        {/*                        </Draggable>*/}
                        {/*                    ))}*/}
                        {/*                    {provided.placeholder}*/}
                        {/*                </KanbanBoardColumn>*/}
                        {/*            )}*/}
                        {/*        </Droppable>*/}
                        {/*    </div>*/}
                        {/*))}*/}
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

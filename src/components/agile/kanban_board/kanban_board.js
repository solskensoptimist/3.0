import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './column';
import Icon from 'components/icon';

/**
 * Component that renders a kanban board with draggable items and columns.
 * Data and functions is handled through props.
 */
export default (props) => {
    const {addActivity, columns, dragEnd, openItem} = props;
    const [hasScrolledRight, setHasScrolledRight] = useState(false);

    useEffect(() => {
        const _handleScroll = (event) => {
            if (document.querySelector('#kanbanBoardContainer').scrollLeft > 0) {
                setHasScrolledRight(true);
            }
        };

        document.querySelector('#kanbanBoardContainer').addEventListener('scroll', _handleScroll);
        return () => document.querySelector('#kanbanBoardContainer').removeEventListener('scroll', _handleScroll);
    }, []);

    const _scrollToRight = () => {
        document.querySelector('#kanbanBoardContainer').scroll(5000, 0);
    };

    return (
        <div className='kanbanBoardWrapper'>
            <div className='kanbanBoardWrapper__kanbanBoard'>
                <div className='kanbanBoardWrapper__kanbanBoard__header'>
                    {(props.columns.length > 4 && !hasScrolledRight) ?
                        <div className='kanbanBoardWrapper__kanbanBoard__header__indicator' onClick={_scrollToRight}>
                            {tc.agileScrollIndicator}
                            <Icon val='forwardArrowRounded'/>
                        </div> : null
                    }
                </div>
                <DragDropContext onDragEnd={dragEnd}>
                    <div className='kanbanBoardWrapper__kanbanBoard__content'>
                        <Droppable
                            droppableId='board'
                            type='column'
                            direction='horizontal'
                        >
                            {(provided) => (
                                <div className='kanbanBoardWrapper__kanbanBoard__content__container'
                                     id='kanbanBoardContainer'
                                     ref={provided.innerRef}
                                     {...provided.droppableProps}
                                >
                                    {columns.map((column, index) => (
                                        <Column
                                            addActivity={addActivity}
                                            column={column}
                                            key={column.id}
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
                </DragDropContext>
            </div>
        </div>
    );
};

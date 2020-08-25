import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import Item from '../item';

export default (props) => {
    const {addActivity, items, isDraggingOver, openItem, provided} = props;

    return (
        <div className={(isDraggingOver) ? 'itemsListWrapper isDraggingOver' : 'itemsListWrapper'} ref={provided.innerRef}>
            <div className='itemsListWrapper__itemsList'>
                {items.map((item, i) => {
                    return (
                        <Draggable
                            draggableId={item._id ? item._id.toString() : item.prospectId.toString()}
                            index={i}
                            key={item._id ? item._id : item.prospectId}
                        >
                            {(dragProvided, dragSnapshot) => (
                                <Item
                                    addActivity={addActivity}
                                    item={item}
                                    openItem={openItem}
                                    provided={dragProvided}
                                    snapshot={dragSnapshot}
                                />
                            )}
                        </Draggable>
                    );
                })}
                {provided.placeholder}
            </div>
        </div>
    );
};

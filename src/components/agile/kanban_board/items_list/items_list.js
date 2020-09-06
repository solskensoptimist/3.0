import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {getPagedProspects} from 'store/agile/tasks';
import {tc} from 'helpers';
import Item from '../item';

export default (props) => {
    const {addActivity, allProspectsReceived, columnId, items, openItem, provided} = props;

    return (
        <div className='itemsListWrapper' ref={provided.innerRef}>
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
                {(columnId === 'prospects' && !allProspectsReceived) ?
                    <div className='itemsListWrapper__itemsList__getMore' onClick={getPagedProspects}>
                        {tc.getMore}
                    </div> : null
                }
                {provided.placeholder}
            </div>
        </div>
    );
};

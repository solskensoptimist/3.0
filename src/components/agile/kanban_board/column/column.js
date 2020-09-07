import React, {useState} from 'react';
import {tc} from 'helpers';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import {updateColumnTitle} from 'store/agile/tasks';
import {showFlashMessage} from 'store/flash_messages/tasks';
import Icon from 'components/icon';
import ItemsList from '../items_list';

/**
 * Render Column component.
 * Should be able to remove or edit title of all columns except 'prospects'.
 * Should be able to edit title but not remove column 'idle'.
 */
export default (props) => {
    const {addActivity, allProspectsReceived, column, index, items, removeColumn, title, total} = props;
    const [editTitle, setEditTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(null);

    const _saveNewTitle = async () => {
        if (newTitle.length < 2) {
            return showFlashMessage(tc.columnNameTooShort);
        } else {
            setEditTitle(false);
            setNewTitle(null);
            return await updateColumnTitle({
                id: column.id,
                title: newTitle});
        }
    }

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
                                <Icon val='dragIndicator'/>
                                {(editTitle) ?
                                    <input onChange={(e) => {setNewTitle(e.target.value)}} type='text' value={(newTitle) ? newTitle : ''}/> :
                                    <span>{title}</span>
                                }
                            </div>
                            {(column.id === 'prospects' || column.id === 'idle') ?
                                <div className='columnWrapper__column__header__total'>
                                    {total} {tc.aPiece.toLowerCase()}
                                </div> :
                                <>
                                    {!(editTitle) ?
                                        <div className='columnWrapper__column__header__totalHideOnHover'>
                                            {total} {tc.aPiece.toLowerCase()}
                                        </div> : null
                                    }
                                    {(editTitle) ?
                                        <>
                                            <div className='columnWrapper__column__header__iconAlwaysVisible' onClick={() => {
                                                setEditTitle(false);
                                                setNewTitle(null);
                                            }}
                                            >
                                                <Icon val='clear'/>
                                            </div>
                                            <div className='columnWrapper__column__header__iconAlwaysVisible' onClick={_saveNewTitle}>
                                                <Icon val='save'/>
                                            </div>
                                        </> :
                                        <>
                                            <div className='columnWrapper__column__header__icon' onClick={(e) => {
                                                e.stopPropagation();
                                                setNewTitle(title);
                                                setEditTitle(true);
                                            }}
                                            >
                                                <Icon val='edit'/>
                                            </div>
                                            <div className='columnWrapper__column__header__icon' onClick={(e) => {
                                                e.stopPropagation();
                                                removeColumn(column.id);
                                            }}
                                            >
                                                <Icon val='remove'/>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                        </div>
                        <div className='columnWrapper__column__content'>
                            <Droppable droppableId={column.id} type='item'>
                                {(provided) => (
                                    <ItemsList
                                        addActivity={addActivity}
                                        allProspectsReceived={allProspectsReceived}
                                        columnId={column.id}
                                        items={items}
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

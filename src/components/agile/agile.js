import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addActivity, getColumnsData, getFilters, moveItem, setPreviewId, sortColumns, updateFilters, updateColumnStructure} from 'store/agile/tasks';
import sharedAgileHelper from 'shared_helpers/agile_helper';
import {agileHelper, tc} from 'helpers';
import id from'valid-objectid';
import AgileAddActivity from './agile_add_activity';
import AgilePreview from './agile_preview';
import KanbanBoard from './kanban_board';
import Loading from 'components/loading';
import Menu from 'components/menu';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

const Agile = (state) => {
    const [columns, setColumns] = useState(null);
    const [activeFilters, setActiveFilters] = useState(null);
    const [activeLists, setActiveLists] = useState(null);
    const [addActivityItem, setAddActivityItem] = useState(null);
    const [itemToMove, setItemToMove] = useState(null);
    const [newColumnName, setNewColumnName] = useState(null);
    const [itemOpenInPreview, setItemOpenInPreview] = useState(null);
    const [removeColumn, setRemoveColumn] = useState(null);
    const [showAddNewColumn, setShowAddNewColumn] = useState(false);
    const [showRemoveColumn, setShowRemoveColumn] = useState(null);
    const newColumnNameInputRef = useRef(null);

    useEffect(() => {
        getColumnsData();
        getFilters();
    }, []);

    useEffect(() => {
        // Get deals and prospects.
        getColumnsData();

        // Set active filters.
        if (state.agile.filters && Array.isArray(state.agile.filters)) {
            const lists = [];
            const filters = [];
            state.agile.filters.forEach((num) => {
                if (num.meta.type === 'list' && num.active) {
                    lists.push(num.id);
                } else if (num.active) {
                    filters.push(num.id);
                }
            });

            setActiveLists(lists);
            setActiveFilters(filters);
        }
    }, [state.agile.filters]);

    useEffect(() => {
        if (state.agile.columns && Array.isArray(state.agile.columns)) {
            setColumns(state.agile.columns);
        }

    }, [state.agile.columns]);

    useEffect(() => {
        if (showAddNewColumn) {
            newColumnNameInputRef && newColumnNameInputRef.current && newColumnNameInputRef.current.focus();
        }
    }, [showAddNewColumn]);

    useEffect(() => {
        setItemOpenInPreview(state.agile.previewId);
    }, [state.agile.previewId]);

    /**
     * Can be executed from <AgileAddActivity/> or from _moveItem(), depending on if we are simultaneously moving an item and adding an activity.
     * @param payload.action
     * @param payload.comment
     * @param payload.dealId - string (optional) - When executed from _moveItem().
     * @param payload.event_date
     * @param payload.performed - bool - Historic/performed or planned activity.
     */
    const _addActivity = async (payload) => {
        await addActivity({
            action: payload.action,
            comment: payload.comment,
            dealId: payload.dealId ? payload.dealId : addActivityItem,
            event_date: payload.event_date,
            performed: payload.performed,
        });

        return setAddActivityItem(null);
    };

    const _addColumn = async () => {
        if (!newColumnName || (newColumnName && newColumnName.length < 2)) {
            return showFlashMessage(tc.columnNameTooShort);
        }

        setShowAddNewColumn(false);

        // Build an id. We rebuild these to text in Activity component, so no long unreadable ids please.
        // Replace spaces with dashes, rplace åäö etc...
        let id = newColumnName.replace(/[ÅÄ]/ig, "a")
                                .replace(/[Ö]/ig, "o")
                                .replace(/\s/g, '-')
                                .replace(/[^A-Z0-9-]/ig, "")
                                .toLowerCase().trim();

        // If id already exists add integer.
        const _createUniqueId = (str, i) => {
            if (!columns.find((num) => num.id === str)) {
                return id = str;
            } else if (!columns.find((num) => num.id === str + '-' + i)) {
                return id = str + '-' + i;
            } else {
                return _createUniqueId(str, i + 1)
            }
        };

        _createUniqueId(id, 0);

        const newColumns = JSON.parse(JSON.stringify(columns));
        newColumns.push({
            id: id,
            title: newColumnName,
            items: [],
        });

        await updateColumnStructure(newColumns);

        // Scroll a bit to the right do display new column.
        setTimeout(() => {
            document.querySelector('#kanbanBoardContainer').scroll(5000, 0);
        }, 1000);

        return showFlashMessage(tc.columnHasBeenAdded);
    };

    /**
     * Handles when we drag something, both columns and items.
     *
     * First adjust columns in component state.
     * Then most of the times what happends here is we move an item to a new column, so we prompt <AgileAddActivity/> by setting addActivityItem.
     * In <AgileAddActivity/> we execute _moveItem() which makes backend call to adjust deal phase.
     * If we simultaneously move an item and adding an activity, then _moveItem() executes _addActivity() when its finished.
     */
    const _dragEnd = async (event) => {
        if (!event.destination || (event.destination && event.destination.droppableId === 'prospects')) {
            return;
        }

        if (event.type === 'column') {
            // Moving a column.
            const newColumns = JSON.parse(JSON.stringify(columns)); // Clone columns.
            [newColumns[event.source.index], newColumns[event.destination.index]] = [newColumns[event.destination.index], newColumns[event.source.index]];
            setColumns(newColumns);
            return await updateColumnStructure(newColumns);
        } else {
            // Moving an item.
            // Only possible to drag to another column. To rearrange columns internally we use sort.
            if (event.source.droppableId !== event.destination.droppableId) {
                // Set item to move.
                let moveObject = {};
                columns.forEach((column) => {
                    if (column.id === 'prospects' && column.items.find((num) => num.prospectId.toString() === event.draggableId)) {
                        moveObject = {
                            item: column.items.find((num) => num.prospectId.toString() === event.draggableId)
                        };
                    } else if (column.items.find((num) => num._id === event.draggableId)) {
                        moveObject = {
                            item: column.items.find((num) => num._id === event.draggableId)
                        };
                    }
                });

                // Extra guard, should never happen.
                if (!moveObject.hasOwnProperty('item')) {
                    return showFlashMessage((id.isValid(event.draggableId)) ?
                        tc.couldNotMoveDeal :
                        tc.couldNotMoveProspect);
                }

                // Assign some extra properties to the item we're moving, used in _moveItem().
                moveObject = Object.assign(moveObject, {
                    source: event.source.droppableId,
                    target: event.destination.droppableId,
                });
                setItemToMove(moveObject);

                // Set addActivityItem to prompt AgileAddActivity popup.
                return setAddActivityItem(event.draggableId);
            }
        }
    };

    /**
     * Update the phase of a deal.
     * Executed from <AgileAddActivity/>.
     *
     * @param payload.addActivity - bool - Set to true when also adding activity after move.
     * @param payload.addActivityObject - object - Sent forward to _addActivity() if addActivity is true.
     */
    const _moveItem = async (payload) => {
        let listId = null;
        if (itemToMove.item.listId) {
            listId = itemToMove.item.listId;
        }
        if (itemToMove.item.meta && itemToMove.item.meta.moved_from_list) {
            listId = itemToMove.item.meta.moved_from_list;
        }

        let prospectIds;
        if (itemToMove.item.prospects && Array.isArray(itemToMove.item.prospects)) {
            prospectIds = itemToMove.item.prospects.join(',');
        }

        const dealId = await moveItem({
            id: itemToMove.item._id ? itemToMove.item._id : itemToMove.item.prospectId.toString(),
            listId: listId,
            prospectIds: prospectIds,
            target: itemToMove.target,
            source: itemToMove.source,
        });

        if (payload.addActivity) {
            payload.addActivityObject.dealId = dealId; // If a prospect was moved, a deal has been created with a new id.
            await _addActivity(payload.addActivityObject);
        } else {
            setAddActivityItem(null);
        }

        return setItemToMove(null);
    };

    const _removeColumn = async () => {
        let newColumns = JSON.parse(JSON.stringify(columns)); // Clone columns.
        newColumns = newColumns.filter((column) => column.id !== removeColumn);

        setShowRemoveColumn(false);
        setRemoveColumn(null);
        await updateColumnStructure(newColumns);
        return showFlashMessage(tc.columnHasBeenRemoved);
    };

    const _stateCheck = () => {
        return !!(state && state.agile && columns && state.lists && state.lists.lists && activeFilters);
    };

    return ( _stateCheck() ?
        <div className='agileWrapper'>
            <div className='agileWrapper__agile'>
                <div className='agileWrapper__agile__header'>
                    <Menu items={[
                        {
                            checkboxes: true,
                            label: tc.filter,
                            items: sharedAgileHelper.getDefaultFilters()
                                .filter((filter) => filter.id !== 'include_colleagues')
                                .map((filter) => {
                                return {
                                    active: activeFilters.includes(filter.id),
                                    label: filter.name,
                                    onClick: async () => {
                                        await updateFilters({id: filter.id, name: filter.name, type:'default'});
                                    }
                                };
                            }),
                            type: 'dropdown'
                        },
                        {
                            checkboxes: true,
                            label: tc.lists,
                            items: state.lists.lists.map((list) => {
                                return {
                                    active: activeLists.includes(list._id),
                                    label: list.name,
                                    onClick: async () => {
                                        await updateFilters({id: list._id, name: list.name, type:'list'});
                                    }
                                }
                            }),
                            type: 'dropdown'
                        },
                        {
                            checkboxes: true,
                            label: tc.sort,
                            items: agileHelper.getColumnSortValues.map((num) => {
                                    return {
                                        active: state.agile.sort === num,
                                        label: tc[num],
                                        onClick: () => {
                                            sortColumns({sort: num});
                                        }
                                    };
                                }),
                            type: 'dropdown'
                        },
                        {
                            label: tc.addColumn,
                            onClick: () => {setShowAddNewColumn(true)},
                            type: 'button'
                        },
                    ]}
                    />
                </div>
                <div className='agileWrapper__agile__content'>
                    <KanbanBoard
                        addActivity={(id) => {
                            setAddActivityItem(id);
                        }}
                        allProspectsReceived={state.agile.allProspectsReceived}
                        columns={columns}
                        dragEnd={ _dragEnd}
                        removeColumn={(id) => {
                            setShowRemoveColumn(true);
                            setRemoveColumn(id);
                        }}
                    />
                    {(itemOpenInPreview) ?
                        <Popup close={() => {setPreviewId(null)}} noPadding={true} noScroll={true} size='medium'>
                            <AgilePreview
                                close={() => {setPreviewId(null)}}
                                id={itemOpenInPreview}
                            />
                        </Popup> : null
                    }
                    {(!itemOpenInPreview && addActivityItem) ?
                        <Popup
                            close={() => {
                                setAddActivityItem(null);
                                setItemToMove(null);
                            }}
                           size='medium'
                        >
                            <AgileAddActivity
                                addActivity={_addActivity}
                                close={() => {
                                    setAddActivityItem(null);
                                    setItemToMove(null);
                                }}
                                isMoving={!!(itemToMove)}
                                moveItem={_moveItem}
                            />
                        </Popup> : null
                    }
                    {(!itemOpenInPreview && showAddNewColumn) ?
                        <Popup close={() => {setShowAddNewColumn(false)}} size='small'>
                            <div className='agilePopupWrapper__agilePopup'>
                                <div className='agilePopupWrapper__agilePopup'>
                                    <div className='agilePopupWrapper__agilePopup__header'>
                                        <WidgetHeader
                                            iconVal='add'
                                            headline={tc.addColumn}
                                        />
                                    </div>
                                    <div className='agilePopupWrapper__agilePopup__content'>
                                        <p>{tc.nameNewColumn}:</p>
                                        <input onChange={(e) => {setNewColumnName(e.target.value)}} ref={newColumnNameInputRef} type='text'/>
                                    </div>
                                    <div className='agilePopupWrapper__agilePopup__footer'>
                                        <WidgetFooter buttonOneFunc={_addColumn}/>
                                    </div>
                                </div>
                            </div>
                        </Popup> : null
                    }
                    {(!itemOpenInPreview && showRemoveColumn && removeColumn) ?
                        <Popup close={() => {setShowRemoveColumn(false)}} size='medium'>
                            <div className='agilePopupWrapper'>
                                <div className='agilePopupWrapper__agilePopup'>
                                    <div className='agilePopupWrapper__agilePopup__header'>
                                        <WidgetHeader
                                            iconVal='remove'
                                            headline={tc.removeColumn}
                                        />
                                    </div>
                                    <div className='agilePopupWrapper__agilePopup__content'>
                                        {(columns.find((column) => column.id === removeColumn).items.length) ?
                                            <p>{tc.columnHaveToBeEmptyToRemove}</p> :
                                            <p>{tc.removeEnsure}</p>
                                        }
                                    </div>
                                    <div className='agileAddColumnWrapper__agileAddColumn__footer'>
                                        {(columns.find((column) => column.id === removeColumn).items.length) ?
                                            <WidgetFooter
                                                buttonOneFunc={() => {
                                                    setShowRemoveColumn(null);
                                                    setRemoveColumn(null);
                                                }}
                                                buttonOneText={tc.ok}
                                            /> :
                                            <WidgetFooter
                                                buttonOneFunc={_removeColumn}
                                                buttonOneText={tc.remove}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </Popup> : null
                    }
                </div>
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        agile: state.agile,
        lists: state.lists,
    };
};

export default connect(
    MapStateToProps,
)(Agile);

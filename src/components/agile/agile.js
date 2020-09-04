import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addActivity, getColumnsData, getFilters, sortColumns, updateFilters, updateColumnStructure} from 'store/agile/tasks';
import sharedAgileHelper from 'shared_helpers/agile_helper';
import {agileHelper, tc} from 'helpers';
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
    const [moveItem, setMoveItem] = useState(null);
    const [newColumnName, setNewColumnName] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
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
        if (state.agile.filters && state.agile.filters.length) {
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

    const _addActivity = async (payload) => {
        console.log('payload i _addActivity', payload);
        console.log('moveItem i _addActivity', moveItem);
        /*
        Kolla om payload.skipAddActivity === true.
        Isåfall ska vi inte göra någon activity.

        Kolla sedan på om vi har en moveItem i state, isåfall ska vi flytta på itemet.

        moveItem ska se ut såhär {
            deal: {},
            target: '',
            source: '',
        }

        Har vi allt vi behöver för att gå vidare..?

        Om vi bara skiter i reason alla gånger vi flyttar till en kolumn, även när det är förlorad,
        så borde det gå bra?
         */

        // await addActivity({
        //     action: payload.action,
        //     comment: payload.comment,
        //     dealId: addActivityItem,
        //     event_date: payload.date,
        //     performed: payload.activityIsPerformed,
        // });
        setAddActivityItem(null);
        setMoveItem(null);
    };

    const _addColumn = async () => {
        if (!newColumnName || (newColumnName && newColumnName.length < 2)) {
            return showFlashMessage(tc.columnNameTooShort);
        }

        setShowAddNewColumn(false);

        let id = newColumnName.replace(/[ÅÄ]/ig, "a")
                        .replace(/[Ö]/ig, "o")
                        .replace(/[^A-Z0-9]/ig, "")
                        .toLowerCase().trim();

        // If id already exists add integer (no long ugly ids please, this will be value for deal phases).
        const _createUniqueId = (str, i) => {
            if (!columns.find((num) => num.id === str)) {
                return id = str;
            } else if (!columns.find((num) => num.id === str + '-' + i)) {
                return id = str + '-' + i;
            } else {
                return _createUniqueId(str, i + 1)
            }
        };

        await _createUniqueId(id, 0);

        const newColumns = JSON.parse(JSON.stringify(columns)); // Clone columns.
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

    const _dragEnd = async (event) => {
        console.log(event);
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
            const newColumns = JSON.parse(JSON.stringify(columns)); // Clone columns.
            const sourceColumn = newColumns.find(column => column.id === event.source.droppableId);
            const destinationColumn = newColumns.find(column => column.id === event.destination.droppableId);
            const [removedItem] = sourceColumn.items.splice(event.source.index, 1);

            if (event.source.droppableId === event.destination.droppableId) {
                // Dragged within same column. (Order is not saved, only save column order in component state until next reload.)
                sourceColumn.items.splice(event.destination.index, 0, removedItem);
                setColumns(newColumns);
            } else {
                // Dragged to another column.
                // Adjust the columns.
                removedItem.column = event.destination.droppableId;
                destinationColumn.items.splice(event.destination.index, 0, removedItem);
                setColumns(newColumns);

                // Set deal/prospect to move.
                let move = null;
                columns.forEach((column) => {
                    if (column.id === 'prospects' && column.items.find((num) => num.prospectId === event.draggableId)) {
                        move = {
                            deal: column.items.find((num) => num.prospectId === event.draggableId)
                        };
                    } else if (column.items.find((num) => num._id === event.draggableId)) {
                        move = {
                            deal: column.items.find((num) => num._id === event.draggableId)
                        };
                    }
                });

                // Assign some extra properties to the deal we're moving, used in _addActivity().
                move = Object.assign(move, {
                    source: event.source.droppableId,
                    target: event.destination.droppableId,
                });
                setMoveItem(move);

                // Set item to add activity for.
                setAddActivityItem(event.draggableId);
            }
        }
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
                        columns={columns}
                        dragEnd={ _dragEnd}
                        openItem={(id) => {
                            setPreviewItem(id);
                        }}
                        removeColumn={(id) => {
                            setShowRemoveColumn(true);
                            setRemoveColumn(id);
                        }}
                    />
                    {(previewItem) ?
                        <Popup close={() => {setPreviewItem(null)}} size='big'>
                            <AgilePreview
                                close={() => {setPreviewItem(null)}}
                                id={previewItem}
                            />
                        </Popup> : null
                    }
                    {(!previewItem && addActivityItem) ?
                        <Popup close={(!moveItem) ? () => {setAddActivityItem(null)} : null} size='medium'>
                            <AgileAddActivity
                                close={() => {setAddActivityItem(null)}}
                                moveItem={!!(moveItem)}
                                save={_addActivity}
                            />
                        </Popup> : null
                    }
                    {(!previewItem && showAddNewColumn) ?
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
                    {(!previewItem && showRemoveColumn && removeColumn) ?
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

import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {getColumnsData, getFilters, sortColumns, updateFilters, updateColumnStructure} from 'store/agile/tasks';
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
        if (!event.destination || (event.destination && event.destination.droppableId === 'prospects')) {
            return;
        }

        if (event.type === 'column') {
            const newColumns = JSON.parse(JSON.stringify(columns)); // Clone columns.
            [newColumns[event.source.index], newColumns[event.destination.index]] = [newColumns[event.destination.index], newColumns[event.source.index]];
            setColumns(newColumns);
            return await updateColumnStructure(newColumns);
        } else {
            const newColumns = JSON.parse(JSON.stringify(columns)); // Clone columns.
            const sourceColumn = newColumns.find(column => column.id === event.source.droppableId);
            const destinationColumn = newColumns.find(column => column.id === event.destination.droppableId);
            const [removedItem] = sourceColumn.items.splice(event.source.index, 1);

            if (event.source.droppableId === event.destination.droppableId) {
                // Dragged within same column. We save column order in component state until next reload.
                sourceColumn.items.splice(event.destination.index, 0, removedItem);
                setColumns(newColumns);
            } else {
                // Dragged to another column.
                // Skicka till moveDeal, och ange eventuellt action....
                // Ska vi sätta nya kolumner som nedan, eller bara hämta data från backend..?
                /*
                Kanske sätta movingDeal = true, och när vi körs addActivity körs det i agile.js
                istället för i komponenten. Och om movingDeal är true så skickar vi till moveDeal
                samtidigt som addActivity.
                 */
                removedItem.column = event.destination.droppableId;
                destinationColumn.items.splice(event.destination.index, 0, removedItem);
                setColumns(newColumns);
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
                            <AgilePreview close={() => {setPreviewItem(null)}} id={previewItem}/>
                        </Popup> : null
                    }
                    {(!previewItem && addActivityItem) ?
                        <Popup close={() => {setAddActivityItem(null)}} size='medium'>
                            <AgileAddActivity close={() => {setAddActivityItem(null)}} id={addActivityItem}/>
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
                                        <WidgetFooter save={_addColumn}/>
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
                                                save={() => {
                                                    setShowRemoveColumn(null);
                                                    setRemoveColumn(null);
                                                }}
                                                saveText={tc.ok}
                                            /> :
                                            <WidgetFooter
                                                save={_removeColumn}
                                                saveText={tc.remove}
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

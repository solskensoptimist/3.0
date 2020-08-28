import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getAgileColumns, getAgileFilters, sortColumns, updateAgileFilters} from 'store/agile/tasks';
import uuid from 'uuid/v1';
import sharedAgileHelper from 'shared_helpers/agile_helper';
import {agileHelper, tc} from 'helpers';
import KanbanBoard from './kanban_board';
import Loading from 'components/loading';
import Menu from 'components/menu';

const Agile = (state) => {
    const [columns, setColumns] = useState(null);
    const [activeFilters, setActiveFilters] = useState(null);
    const [activeLists, setActiveLists] = useState(null);
    const [openedItem, setOpenedItem] = useState(null);

    useEffect(() => {
        getAgileColumns();
        getAgileFilters();
    }, []);

    useEffect(() => {
        // Get deals and prospects.
        getAgileColumns();

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
        if (state.agile.columns && state.agile.columns.length) {
            setColumns(state.agile.columns);
        }

    }, [state.agile.columns]);

    const _addActivity = (id) => {
        console.log('Add activity för', id);
    };

    const _addColumn = () => {
        const column = {
            id: uuid(),
            title: 'Ny kolumn ' + (columns.length + 1), // Hämta namn från input...
            items: [],
        };

        setColumns(columns.concat([column]));
    };

    const _closeItem = () => {
        setOpenedItem(null);
    };

    const _dragEnd = (event) => {
        console.log('event i handeDragEnd', event);

        // Ska vi förhindra att man drar till kolumnen prospects, eller..?
        // Backend call där vi ändrar phase på en affär/prospekt, behövs ny endpoint(?).

        if (!event.destination) {
            return;
        }

        if (event.type === 'column') {
            console.log('Detta är kolumn, hur hanterar vi det?');
            // Vi ska sortera kolumnerna och sätta i state (det är väl det som görs nedan)
            // Vi ska spara phase för item via backend call
            // Spara kolumnstrukturen via backend call.
            // Sen ska vi lyssna på store, och sätta till state. Sätta till state gör vi alltså inte här..?
        } else {
            console.log('Detta är item');

            // Vi ska sortera kolumnerna (det är väl det som görs nedan)
            // Vi ska spara phase för item via backend call
            // Vi ska också spara kolumnens ordning via backend call (vi lär väl få ha ett backend call där vi sparar hela kolumnstrukturen)
            // Sen ska vi lyssna på store, och sätta till state. Sätta till state gör vi alltså inte här..?

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
        }
    };

    const _openItem = (id) => {
        console.log('Öppna id, anropa Preview om vi ska ha en sådan.', id);
        //setOpenedItem(item);
    };

    const _stateCheck = () => {
        return !!(state && state.agile && columns && state.lists && state.lists.lists);
    };

    const _updateFilters = (payload) => {
        console.log('payload i _updateFilters', payload);
        // I payload har vi ilist.name... behöver vi skicka med det, eller hanteras det på backend?
        // Kolla i 2.0 vad som skickas med.
        // return updateAgileFilters({});
    };

    return ( _stateCheck() ?
        <div className='agileWrapper'>
            <div className='agileWrapper__agile'>
                <div className='agileWrapper__agile__header'>
                    <Menu items={[
                        {
                            checkboxes: true,
                            label: tc.filter,
                            items: sharedAgileHelper.getDefaultFilters().map((filter) => {
                                return {
                                    active: activeFilters.includes(filter.id),
                                    label: filter.name,
                                    onClick: () => {
                                        _updateFilters({id: filter.id, name: filter.name, type:'default'});
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
                                    onClick: () => {
                                        _updateFilters({id: list._id, name: list.name, type:'list'});
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
                                            sortColumns(num);
                                        }
                                    };
                                }),
                            type: 'dropdown'
                        },
                        {
                            label: tc.addColumn,
                            onClick: _addColumn,
                            type: 'button'
                        },
                    ]}
                    />
                </div>
                <div className='agileWrapper__agile__content'>
                    <KanbanBoard
                        addActivity={_addActivity}
                        columns={columns}
                        dragEnd={ _dragEnd}
                        openItem={_openItem}
                    />
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

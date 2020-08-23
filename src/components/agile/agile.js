import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getAgile} from 'store/agile/tasks';
import uuid from 'uuid/v1';
import {tc} from 'helpers';
import KanbanBoard from './kanban_board';
import Menu from 'components/menu';

const Agile = (state) => {
    const [columns, setColumns] = useState([]);
    const [openedItem, setOpenedItem] = useState(null);
    console.log('columns i agile', columns);

    // Lyssna på när state.agile.filter ändras (och valda listor om de ligger i en annan property), och kör getAgile då.
    useEffect(() => {
        getAgile();
    }, []);

    useEffect(() => {
        // Ska såklart hämtas från db....
        const userColumns = [
            {
                id: 'prospects',
                title: tc.notStarted
            },
            {
                id: 'todo',
                title: 'Påbörjade'
            },
            {
                id: 'contacted',
                title: 'Kontaktade'
            },
            {
                id: 'negotiation',
                title: 'Under förhandling'
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
                state.agile.data.deals.forEach((item) => {
                    const col = columnsMapped.find((column) => column.id === item.phase);
                    if (col) {
                        col.items.push(item);
                    }
                });
            }

            // If prospects, push to 'prospects' column items array.
            if (state.agile.data.prospects && state.agile.data.prospects.length) {
                state.agile.data.prospects.forEach((item) => {
                    const col = columnsMapped.find((column) => column.id === 'prospects');
                    if (col) {
                        col.items.push(item);
                    }
                });
            }
        }
        setColumns(columnsMapped);
    }, [state.agile.data]);

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

    const _dragEnd= (event) => {
        console.log('event i handeDragEnd', event);

        // Ska vi förhindra att man drar till kolumnen prospects, eller..?
        // Backend call där vi ändrar phase på en affär/prospekt, behövs ny endpoint(?).

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

    const _closeItem = () => {
        setOpenedItem(null);
    };

    const _closeMenu = (id) => {
        console.log('Stäng menu för', id);
    };

    const _openItem = (id) => {
        console.log('Öppna id, anropa Preview om vi ska ha en sådan.', id);
        //setOpenedItem(item);
    };

    const _openMenu = (id) => {
        console.log('Öppna menu för', id);
    };

    return (
        <div className='agileWrapper'>
            <div className='agileWrapper__agile'>
                <div className='agileWrapper__agile__header'>
                    <Menu items={[
                        {
                            label: tc.filter,
                            items: [
                                {label: 'Dropdownitem nummer 1', onClick: () => {}},
                                {label: 'Dropdownitem nummer 2', onClick: () => {}}],
                            type: 'dropdown'
                        },
                        {
                            label: tc.lists,
                            items: [
                                {label: 'Dropdownitem nummer 1', onClick: () => {}},
                                {label: 'Dropdownitem nummer 2', onClick: () => {}}],
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
                        openMenu={_openMenu}
                    />
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        agile: state.agile,
    };
};

export default connect(
    MapStateToProps,
)(Agile);

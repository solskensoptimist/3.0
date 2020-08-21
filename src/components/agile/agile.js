import React, {useEffect, useState} from 'react';
import KanbanBoard from './kanban_board';
import {connect} from 'react-redux';

import uuid from 'uuid/v1';
import moment from 'moment';

const Agile = () => {
    const [columns, setColumns] = useState([]);

    // Här ska vi hämta verklig data...
    useEffect(() => {
        // Mock data.
        const data = {
            columns: [
                {
                    id: 'incoming',
                    title: 'Incoming'
                },
                {
                    id: 'in_progress',
                    title: 'In progress'
                },
                {
                    id: 'in_review',
                    title: 'In review'
                },
                {
                    id: 'completed',
                    title: 'Completed'
                }
            ],
            tasks: [
                {
                    id: uuid(),
                    ref: '38',
                    phase: 'incoming',
                    title: 'Call with sales of HubSpot',
                    desc:
                        'Duis condimentum lacus finibus felis pellentesque, ac auctor nibh fermentum. Duis sed dui ante. Phasellus id eros tincidunt, dictum lorem vitae, pellentesque sem. Aenean eu enim sit amet mauris rhoncus mollis. Sed enim turpis, porta a felis et, luctus faucibus nisi. Phasellus et metus fermentum, ultrices arcu aliquam, facilisis justo. Cras nunc nunc, elementum sed euismod ut, maximus eget nibh. Phasellus condimentum lorem neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sagittis pharetra eleifend. Suspendisse potenti.',
                    members: [
                        '/images/avatars/avatar_1.png',
                        '/images/avatars/avatar_5.png',
                        '/images/avatars/avatar_6.png'
                    ],
                    files: 0,
                    comments: 1,
                    progress: 0,
                    deadline: moment().add(7, 'days')
                },
                {
                    id: uuid(),
                    ref: '37',
                    phase: 'incoming',
                    title: 'Interview for the Asis. Sales Manager',
                    desc:
                        'We are looking for vue experience and of course node js strong knowledge',
                    members: ['/images/avatars/avatar_2.png', '/images/avatars/avatar_3.png'],
                    files: 0,
                    comments: 2,
                    progress: 0,
                    deadline: moment().add(6, 'days')
                },
                {
                    id: uuid(),
                    ref: '39',
                    phase: 'incoming',
                    title: 'Change the height of the top bar because it looks too chunky',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: ['/images/avatars/avatar_11.png'],
                    files: 0,
                    comments: 0,
                    progress: 0,
                    deadline: moment().add(5, 'days')
                },
                {
                    id: uuid(),
                    ref: '19',
                    phase: 'incoming',
                    title: 'Integrate Stripe API',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: [
                        '/images/avatars/avatar_6.png',
                        '/images/avatars/avatar_5.png',
                        '/images/avatars/avatar_9.png'
                    ],
                    files: 2,
                    comments: 1,
                    progress: 0,
                    deadline: moment().add(4, 'days')
                },
                {
                    id: uuid(),
                    ref: '15',
                    phase: 'in_progress',
                    title: 'Update the customer API for payments',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: ['/images/avatars/avatar_10.png'],
                    files: 2,
                    comments: 0,
                    progress: 60,
                    deadline: moment().add(4, 'hours')
                },
                {
                    id: uuid(),
                    ref: '10',
                    phase: 'in_progress',
                    title: 'Redesign the landing page',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: [
                        '/images/avatars/avatar_10.png',
                        '/images/avatars/avatar_11.png'
                    ],
                    files: 0,
                    comments: 2,
                    progress: 76,
                    deadline: moment().add(4, 'hours')
                },
                {
                    id: uuid(),
                    ref: '24',
                    phase: 'in_review',
                    title: 'Change the height of the top bar because it looks too chunky',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: [
                        '/images/avatars/avatar_6.png',
                        '/images/avatars/avatar_4.png',
                        '/images/avatars/avatar_2.png'
                    ],
                    files: 0,
                    comments: 7,
                    progress: 90,
                    deadline: moment().subtract(1, 'days')
                },
                {
                    id: uuid(),
                    ref: '21',
                    phase: 'in_review',
                    title: 'Integrate Stripe API',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: [
                        '/images/avatars/avatar_6.png',
                        '/images/avatars/avatar_4.png',
                        '/images/avatars/avatar_8.png',
                        '/images/avatars/avatar_2.png'
                    ],
                    files: 0,
                    comments: 7,
                    progress: 90,
                    deadline: moment().subtract(1, 'days')
                },
                {
                    id: uuid(),
                    ref: '17',
                    phase: 'completed',
                    title: 'Design Customer Management Page',
                    desc: 'Change the height of the top bar because it looks too chunky',
                    members: [
                        '/images/avatars/avatar_6.png',
                        '/images/avatars/avatar_2.png',
                        '/images/avatars/avatar_9.png'
                    ],
                    files: 3,
                    comments: 3,
                    progress: 100,
                    deadline: moment().subtract(7, 'days')
                },
                {
                    id: uuid(),
                    ref: '23',
                    phase: 'completed',
                    title: 'Integrate Messaging API',
                    desc:
                        'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
                    members: [
                        '/images/avatars/avatar_6.png',
                        '/images/avatars/avatar_4.png',
                        '/images/avatars/avatar_5.png',
                        '/images/avatars/avatar_2.png',
                        '/images/avatars/avatar_9.png'
                    ],
                    files: 1,
                    comments: 0,
                    progress: 100,
                    deadline: moment().subtract(7, 'days')
                }
            ]
        };

        // Mappa upp så att tasks hamnar i items array under korrekt kolumn.
        const columnsFormatted = [];

        for (const column of data.columns) {
            columnsFormatted.push({ ...column, items: []});
        }

        for (const task of data.tasks) {
            columnsFormatted.forEach((column) => {
                if (column.id === task.phase) {
                    column.items.push(task);
                }
            });
        }

        setColumns(columnsFormatted);

    }, []);

    return (
        <div className='agileWrapper'>
            <div className='agileWrapper__agile'>
                <div className='agileWrapper__agile__header'>
                    Här ska vi sätta filter mm.
                </div>
                <div className='agileWrapper__agile__content'>
                    <KanbanBoard columns={columns} key={uuid()}/>
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

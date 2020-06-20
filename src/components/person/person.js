import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {getPerson} from 'store/person/tasks';
import Activities from 'components/activities';
import Events from 'components/events';
import Fleet from 'components/fleet';
import Loading from 'components/loading';
import PersonInfo from './person_info';

/**
 * Render person view.
 */
const Person = (state) => {
    const {id} = useParams();
    const [dataIsCollected, setDataIsCollected] = useState(false);

    const _stateCheck = () => {
        return !!(dataIsCollected && state && state.person && state.person.person);
    };

    useEffect(() => {
        const getData = async () => {
            await getPerson({id: id});
            // This flag is to prevent sub components to retrieve information for previous person in store.
            setDataIsCollected(true);
        };

        getData();
    }, [id]);

    return (_stateCheck() ?
        <div className='personWrapper'>
            <div className='personWrapper__person'>
                <div className='personWrapper__person__header'>
                    header
                </div>
                <div className='personWrapper__person__content'>
                    <div className='personWrapper__person__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <PersonInfo/>
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <Fleet prospectId={id} />
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <Fleet historic={true} prospectId={id} />
                    </div>
                    <div className='personWrapper__person__content__item'>
                        <Activities includeComments={true} includeMoved={true} target={id} type='target'/>
                    </div>
                </div>
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        person: state.person,
    };
};

export default connect(
    MapStateToProps,
)(Person);

import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Loading from 'components/loading';

const AgileAddActivity = (state) => {
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (state.props.id && state.agile.columns && Array.isArray(state.agile.columns)) {
            let found;
            state.agile.columns.forEach((column) => {
                if (column.items.find((num) => num._id === state.props.id)) {
                    found = column.items.find((num) => num._id === state.props.id);
                }
            });

            if (found) {
                setItem(found);
            }
        }
    }, [state.agile.columns, state.props.id]);

    const _stateCheck = () => {
        return !!(item);
    };

    return (  _stateCheck() ?
        <div className='agileAddActivityWrapper'>
            <div className='agileAddActivityWrapper__agileAddActivityWrapper'>
                <div className='agileAddActivityWrapper__agileAddActivityWrapper__content'>
                    <p>{item.name}</p>
                    <p>Lägg in utförd/planerad aktivitet med kommentar...</p>
                </div>
            </div>
        </div> :
        <Loading/>

    );
};


const MapStateToProps = (state, props) => {
    return {
        agile: state.agile,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(AgileAddActivity);

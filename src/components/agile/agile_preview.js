import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Loading from 'components/loading';

const AgilePreview = (state) => {
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (state.props.id && state.agile.columns && Array.isArray(state.agile.columns)) {
            let found;
            state.agile.columns.forEach((column) => {
                if (column.id === 'prospects' && column.items.find((num) => num.id === state.props.id)) {
                     found = column.items.find((num) => num.id === state.props.id);
                } else if (column.items.find((num) => num._id === state.props.id)) {
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

    return ( _stateCheck() ?
        <>
            {(item._id) ?
                <div className='agilePreviewWrapper'>
                    <div className='agilePreviewWrapper__agilePreview'>
                        <div className='agilePreviewWrapper__agilePreview__content'>
                            <p>{item.name}</p>
                            <p>rendera deal preview...</p>
                        </div>
                    </div>
                </div> :
                <div className='agilePreviewWrapper'>
                    <div className='agilePreviewWrapper__agilePreview'>
                        <div className='agilePreviewWrapper__agilePreview__content'>
                            <p>rendera prospekt preview...</p>
                        </div>
                    </div>
                </div>
            }
        </> :
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
)(AgilePreview);

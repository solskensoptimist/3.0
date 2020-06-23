import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {saveProspectsToList} from 'store/lists/tasks';
import {getLists} from 'store/lists/tasks';
import {tableHelper, tc} from 'helpers';
import Loading from 'components/loading';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';
import Table from 'components/table';

/**
 * Render a component that saves prospect ids to a new or existing list.
 *
 * @param state.props.prospects - array - Array with prospect ids.
 */
const SaveToList = (state) => {
    const [lists, setLists] = useState([]);
    const [listName, setListName] = useState('');
    const [showExisting, setShowExisting] = useState(true);
    const newListNameInputRef = useRef(null);

    const _saveToList = async () => {
        if (showExisting) {
            state.props.close();
            return await saveProspectsToList({lists: lists, prospectIds: state.props.prospects});
        } else {
            state.props.close();
            return await saveProspectsToList({name: listName, prospectIds: state.props.prospects});
        }
    };

    const _stateCheck = () => {
        return !!(state && state.props && state.lists);
    };

    useEffect(() => {
        getLists();
    }, []);

    useEffect(() => {
        if (!showExisting) {
            newListNameInputRef && newListNameInputRef.current && newListNameInputRef.current.focus();
        }
    }, [showExisting]);

    return ( _stateCheck() ?
        <Popup close={state.props.close} size='big'>
            <div className='saveToListWrapper'>
                <div className='saveToListWrapper__saveToList'>
                    <div className='saveToListWrapper__saveToList__header'>
                        <WidgetHeader
                            iconVal='lists'
                            headline={tc.addToList}
                        />
                    </div>
                    <div className='saveToListWrapper__saveToList__content'>
                        <div className='saveToListWrapper__saveToList__content__menu'>
                            <div className='saveToListWrapper__saveToList__content__menu__item' onClick={() => {setShowExisting(true)}}>{tc.existingLists}</div>
                            <div className='saveToListWrapper__saveToList__content__menu__item'  onClick={() => {setShowExisting(false)}}>{tc.createNewList}</div>
                        </div>
                        {showExisting ?
                            <Table columns={tableHelper.getListsColumns()} onSelect={(arr) => {setLists(arr)}} rows={tableHelper.getListsRows(state.lists.lists)}/> :
                            <div className='saveToListWrapper__saveToList__content__newList'>
                                <p>{tc.nameNewList}:</p><input onChange={(e) => {setListName(e.target.value)}} ref={newListNameInputRef}/>
                            </div>
                        }
                    </div>
                    <div className='saveToListWrapper__saveToList__footer'>
                        <WidgetFooter save={_saveToList}/>
                    </div>
                </div>
            </div>
        </Popup> :
        <Loading/>
    );

};

const MapStateToProps = (state, props) => {
  return {
      lists: state.lists,
      props: props,
  };
};

export default connect(
    MapStateToProps,
)(SaveToList);

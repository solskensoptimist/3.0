import React, {useState} from 'react';
import {connect} from 'react-redux';
import {saveProspectsToList} from 'store/lists/tasks';
import {tc} from 'helpers';
import Loading from 'components/loading';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

/**
 * Render a component that saves prospect ids to a new or existing list.
 *
 * @param state.props.prospects - array - Array with prospect ids.
 */
const SaveToList = (state) => {
    const [showExisting, setShowExisting] = useState(true);

    const _saveToList = async () => {
        return await saveProspectsToList({list: {}, prospects: state.props.prospects});
    };

    const _stateCheck = () => {
        return !!(state && state.props && state.lists);
    };

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
                            <div>Rendera existerande listor mha tabell-komponent.</div> :
                            <div>Skapa ny lista</div>
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

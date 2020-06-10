import React from 'react';
import {createDeal} from 'store/agile/tasks';
import {tc} from 'helpers';
import Popup from 'components/popup';
import Tooltip from 'components/tooltip';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

export default (props) => {
    const _saveDeal = async () => {
        props.close();
        return await createDeal();
    };

    return (
        <Popup close={props.close} size='medium'>
            <div className='createDealWrapper'>
                <div className='createDealWrapper__createDeal'>
                    <div className='createDealWrapper__createDeal__header'>
                        <WidgetHeader
                            iconVal='add'
                            headline={tc.createNewDeal}
                            headlineSub={props.headline ? props.headline : null}
                        />
                    </div>
                    <div className='createDealWrapper__createDeal__content'>
                        content
                    </div>
                    <div className='createDealWrapper__createDeal__footer'>
                        <WidgetFooter save={_saveDeal}/>
                    </div>
                </div>
            </div>
        </Popup>
    );
}

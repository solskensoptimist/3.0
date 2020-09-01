import React from 'react';
import {tc} from 'helpers';
import WidgetHeader from 'components/widget_header';

export default () => {
    return (
        <div className='leadsUploadWrapper'>
            <div className='leadsUploadWrapper__leadsUpload'>
                <div className='leadsUploadWrapper__leadsUpload__header'>
                    <WidgetHeader
                        iconVal='file'
                        headline={tc.uploadLeads}
                    />
                </div>
                <div className='leadsUploadWrapper__leadsUpload__content'>
                    <p>Ladda upp leads</p>
                </div>
            </div>
        </div>
    );
};

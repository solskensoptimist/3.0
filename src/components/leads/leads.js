import React, {useState} from 'react';
import {tc} from 'helpers';
import LeadsUpload from './leads_upload';
import Menu from 'components/menu';
import Popup from 'components/popup';

export default () => {
    const [showUpload, setShowUpload] = useState(false);

    return (
        <div className='leadsWrapper'>
            <div className='leadsWrapper__leads'>
                <div className='leadsWrapper__leads__header'>
                    <Menu items={[
                        {
                            label: tc.uploadLeads,
                            onClick: () => {
                                setShowUpload(true);
                            },
                            type: 'button',
                        },
                    ]}
                    />
                </div>
                <div className='leadsWrapper__leads__content'>
                    <p>LÖAEEEADS</p>
                    {showUpload ?
                        <Popup close={() => {setShowUpload(false)}} size='medium'>
                            <LeadsUpload/>
                        </Popup> : null
                    }
                </div>
            </div>
        </div>
    );
};

import React, {useState} from 'react';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

export default () => {
    const amountIncrease = 4;
    const [showAddContacts, setShowAddContacts] = useState(false);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    return (
        <div className='contactsWrapper'>
            <div className='contactsWrapper__contacts'>
                <div className='contactsWrapper__contacts__header'>
                    <WidgetHeader
                        iconVal='contact'
                        dashboard={
                            <>
                                {showAddContacts ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.hideConnectContacts}><Icon val='linkOff' onClick={() => {setShowAddContacts(false)}}/></Tooltip> :
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.connectContacts}><Icon val='link' onClick={() => {setShowAddContacts(true)}}/></Tooltip>
                                }
                                <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                {minimize ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> :
                                    <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                }
                            </>
                        }
                        headline={tc.contacts}
                        headlineSub={tc.contactsInfo}
                    />
                </div>
                {!minimize &&
                    <div className='contactsWrapper__contacts__content'>
                        Denna komponent ska erbjuda möjlighet att skapa ny kontakt, lista existerande kontakter samt sökruta där man kan koppla tidigare kontakter.
                        Den ska fungera för affär, person, företag (och koncern..?).
                        {showAddContacts && <Search view='select' type='contacts'/>}
                    </div>
                }
            </div>
        </div>
    );
};

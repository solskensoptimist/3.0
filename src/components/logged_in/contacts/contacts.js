import React from 'react';
import Search from 'components/logged_in/search';

export default () => {
    return (
        <div className='contactsWrapper'>
            <div className='contactsWrapper__contacts'>
                <div className='contactsWrapper__contacts__header'>
                </div>
                <div className='contactsWrapper__contacts__content'>
                    Denna komponent ska erbjuda möjlighet att skapa ny kontakt, lista existerande kontakter samt sökruta där man kan koppla tidigare kontakter.
                    Den ska fungera för affär, person, företag (och koncern..?).
                    <Search view='select' type='contacts'/>
                </div>
            </div>
        </div>
    );
};

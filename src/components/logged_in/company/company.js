import React from 'react';
import {useParams} from 'react-router-dom';

export default () => {
    let {id} = useParams();

    return (
        <div className='companyWrapper'>
            <div className='companyWrapper__company'>
                <p>Företagskomponent</p>
                <p>Id: {id}</p>
                <p>Här ska vi hämta kontakter för detta företag, det innebär att vi hämtar kontakter på companyId.
                Det kan finnas kontatketr som har entityId som ett regnr, men companyId är företag. Alla dessa ska
                givetvis hämtas också. Anropar vi bara getContacts med ''entityId' som är orgnr, så ska det lösa sig.
                Bara låter detta ligga kvar som en påminnelse.</p>
                <p>Varje gång som vi sparar en kontakt för ett företag så ska vi skicka med entityName: företagsnamn.</p>
            </div>
        </div>
    );
}

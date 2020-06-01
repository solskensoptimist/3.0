import React from 'react';
import {useParams} from 'react-router-dom';

export default () => {
    const {regNr} = useParams();

    return (
        <div className='carWrapper'>
            <div className='carWrapper__car'>
                <div className='carWrapper__car__header'>
                </div>
                <div className='carWrapper__car__content'>
                    <p>Regnr: {regNr}</p>
                    <p>På denna sida ska man kunna lägga till kontakter också. Viktigt att komma ihåg
                    att lägga till dem på rätt sätt för bilar i savedTo-arrayen. Här är ett exempel på hur det ska se ut:</p>
                    <p>
                        companyId: '5281240',
                        entityId: 'AAG338',
                        entityType: 'car',
                        entityName: 'AAG338'
                    </p>
                    <p>Varje gång vi går in på en sida ska vi hämta biluppgifter, typ från /car/:id...?</p>
                    <p>companyId är alltså user_id för detta fordon. Kom ihåg att också skicka med 'entityName', det
                    ska vara samma som dyker upp när en sökning sker dvs typ märke och modell, tex: "DAF CF (EAD452)".
                    Om inte det finns/går så har jag också sett att man bara sparat regnr som entityName.</p>
                </div>
            </div>
        </div>
    );
};

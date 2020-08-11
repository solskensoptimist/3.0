import React from 'react';
import {useParams} from 'react-router-dom';

export default () => {
    const {id} = useParams();

    return (
        <div className='supertempWrapper'>
            <div className='supertempWrapper__supertemp'>
                <div className='supertempWrapper__supertemp__header'>
                    header
                </div>
                <div className='supertempWrapper__supertemp__content'>
                    <p>Bevakning: {id}</p>
                    <p>Denna bevakning ska redan finnas i state.supertemp.subscriptions[id]..
                    men hämta för säkerhets skull data på nytt genom useEffect - getSupertempData(id: id, limit: 1000).
                    Rendera ut med tabell.</p>
                    <p>Sen ska vi ha samma som på 2.0: Excel-uttag, Spara i lista och flytta till bearbeta.</p>
                </div>
            </div>
        </div>
    );
};

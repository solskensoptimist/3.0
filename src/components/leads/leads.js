import React from 'react';

export default () => {
    return (
        <div className='leadsWrapper'>
            <div className='leadsWrapper__leads'>
                <div className='leadsWrapper__leads__header'>
                    header
                </div>
                <div className='leadsWrapper__leads__content'>
                    <p>Här ska vi visa en tabell för leads, hämta via: /api/leads/get?limit=0</p>
                    <p>Sen ska vi ha samma som på 2.0: Excel-uttag, Spara i lista och flytta till bearbeta.</p>
                </div>
            </div>
        </div>
    );
};

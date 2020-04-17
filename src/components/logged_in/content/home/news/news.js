import React from 'react';
import {tc} from 'helpers';

export default () => {
    const _renderItem = () => {
        return (
            <div className='newsWrapper__news__item'>
                <div className='newsWrapper__news__item__header'>
                    <h3 className='sectionHeading'>Bilprospekt lanserar machine learning prospektering</h3>
                </div>
                <div className='newsWrapper__news__item__content'>
                    <img src='images/chart.jpeg' alt='Example' />
                    <p>
                        En ny art för Sverige har hittats på västkusten av Michael Lundin, som så sent som i februari gjorde ett annat förstafynd för landet. Det rapporterat Dagens natur.
                        Den nyfunna arten är en framgälad marin snäcka med det vetenskapliga namnet Simnia hiscocki. Den har tidigare enbart hittats i England och ett fynd har även gjorts i sydvästra Norge.
                    </p>
                    <h5>Upptäcktes av en slump</h5>
                    <p>
                        Hur arten hittat till svenska vatten är oklart i dagsläget.
                        – Det finns flera möjligheter. De kan vara en del av den svenska marina faunan som inte upptäckts tidigare. Alternativt kan de vara arter som nyligen invandrat söderifrån, och då ha flyttningsmönster som är kompatibla med ökande vattentemperaturer, skriver Artdatabanken i ett pressmeddelande.
                    </p>
                </div>
                <div className='newsWrapper__news__item__footer'>
                    Publicerad: 2019-10-22 13:46
                </div>
            </div>
        );
    };

    return (
        <div className='newsWrapper'>
            <div className='headlineMain'>
                <div className='headlineMain__left'>
                    <h2>{tc.news}</h2>
                    <h3>{tc.newsSub}</h3>
                </div>
            </div>
            <div className='newsWrapper__news'>
                {_renderItem()}
                {_renderItem()}
            </div>
         </div>
    );
}

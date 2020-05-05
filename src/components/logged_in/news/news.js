import React, {useState} from 'react';
import {tc} from 'helpers';
import WidgetHeader from 'components/shared/widget_header';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';

export default () => {
    const [minimize, setMinimize] = useState(false);

    // Temporary, just to have some components for now...
    const _renderItem = () => {
        return (
            <div className='newsWrapper__news__content__item'>
                <div className='newsWrapper__news__content__item__header'>
                    <h3 className='sectionHeading'>Bilprospekt lanserar machine learning prospektering</h3>
                </div>
                <div className='newsWrapper__news__content__item__content'>
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
                <div className='newsWrapper__news__content__item__footer'>
                    Publicerad: 2019-10-22 13:46
                </div>
            </div>
        );
    };

    return (
        <div className='newsWrapper'>
            <div className='newsWrapper__news'>
                <div className='newsWrapper__news__header'>
                    <WidgetHeader
                        dashboard={minimize ? <Tooltip tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                        iconVal='news'
                        headline={tc.news}
                        headlineSub={tc.newsSub}
                    />
                </div>
                <div className={minimize ? 'hide' : 'newsWrapper__news__content'}>
                    {_renderItem()}
                    {_renderItem()}
                </div>
            </div>
         </div>
    );
}

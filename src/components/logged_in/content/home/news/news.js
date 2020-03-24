import React from 'react';
import tc from 'text_content';

export default () => {
    const _renderItem = () => {
        return (
            <div className='newsWrapper__news__item'>
                <div className='newsWrapper__news__item__header'>
                    <h3 className='headlineMedium'>Bilprospekt lanserar machine learning prospektering</h3>
                </div>
                <div className='newsWrapper__news__item__content'>
                    <p>
                        En ny ap-art har hittats i Kongo i Afrika. Det är bara en av två arter av apor som har upptäckts i världen de senaste 28 åren.
                        Man kunde tro att i en tid när hela världen är kartlagd och gps-satelliter patrullerar över oss så skulle man inte kunna upptäcka nya arter, och speciellt inte nya apor.
                        Men det visar sig att det visst går. Om man har tur.
                    </p>
                    <h5>Upptäcktes av en slump</h5>
                    <p>
                        Ett forskningsteam med biologer stannade av en slump i en liten by i Kongo-Kinshasa och såg en ovanlig apa stå bunden vid en stolpe. Den var husdjur till en liten flicka, eftersom apans mamma hade blivit dödad av jägare.
                        – När jag såg den så tänkte jag direkt att det här kan vara något nytt. Vi trodde aldrig att vi skulle hitta en ny art där, men området har utforskats väldigt lite av biologer, säger John Hart, en av forskarna bakom upptäckten.
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

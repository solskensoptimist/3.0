import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {excelHelper, tc} from 'helpers';
import {getSavedExcelSelectors} from 'store/excel/tasks';
import Icon from 'components/icon';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

/**
 * Component used for excel download.
 *
 * @param state.props.close - func - Close component
 */
const Excel = (state) => {
    const [activeSelectors, setActiveSelectors] = useState([]);
    const [hiddenSections, setHiddenSections] = useState([]);

    useEffect(() => {
        if (state.excel.activeSelectors) {
            setActiveSelectors(state.excel.activeSelectors);
        }
    }, [state.excel.activeSelectors]);

    useEffect(() => {
        getSavedExcelSelectors();
    }, []);

    const download = () => {
        // När görs check på om det är tillåtet att ladda ner antal rader? Det sker backend, men vi måste göra något bättre här....
        // Bygg en ny check som kollar detta direkt här..?
        // LÄGG DENNA CHECK DIREKT OCH RENDERA UT FELMEDDELANDE, visa inte ens selektorer om det inte kommer gå att ladda ner.
        // Behöver även kolla på om man har möjlighet till excel, och/eller stora excel.
        // När allt det är klart, kör nedladdning. Kolla var det ska skickas och vad som ska skickas med.
        // Gör bara en för listor just nu. Behöver göra klart hur sökkriterier osv byggs upp innan vi gör den för prospektera/resultat.
    };

    const _renderSelectors = () => {
        const sections = [];
        let index = 0;
        for (const prop in excelHelper.getSelectors()) {
            index++;
            sections.push(
                <div className='excelWrapper__excel__content__selectors__section' key={index}>
                    <div className='excelWrapper__excel__content__selectors__section__header'
                         onClick={() => {
                             if (hiddenSections.includes(prop)) {
                                 setHiddenSections(hiddenSections.filter((num) => num !== prop));
                             } else {
                                 setHiddenSections(hiddenSections.concat([prop]));
                             }
                         }}
                    >
                        <h4>{excelHelper.getSectionHeading(prop)}</h4>
                        <Icon val={hiddenSections.includes(prop) ? 'rightArrow' : 'downArrow'}/>
                    </div>
                        {(!hiddenSections.includes(prop)) ?
                            excelHelper.getSelectors()[prop].map((num, i) => {
                                return (
                                    <div className={activeSelectors.includes(num.val) ?
                                        'excelWrapper__excel__content__selectors__section__item__active' :
                                        'excelWrapper__excel__content__selectors__section__item'}
                                         key={i}
                                         onClick={() => {setActiveSelectors(activeSelectors.concat([num.val]))}}
                                    >
                                        <Icon val={activeSelectors.includes(num.val) ? 'check' : 'checkbox'}/>
                                        <span>{num.label}</span>
                                    </div>
                                )
                            }) : null
                        }
                </div>
            );
        }

        return (
            <div className='excelWrapper__excel__content__selectors'>
                {sections}
            </div>
        );
    };

    return (
        <Popup close={state.props.close} size='big'>
            <div className='excelWrapper'>
                <div className='excelWrapper__excel'>
                    <div className='excelWrapper__excel__header'>
                        <WidgetHeader
                            iconVal='download'
                            headline={tc.excelOutput}
                        />
                    </div>
                    <div className='excelWrapper__excel__content'>
                        <p>{tc.excelSelectorsInfo}</p>
                        {_renderSelectors()}
                    </div>
                    <div className='excelWrapper__excel__footer'>
                        <WidgetFooter save={download} saveText={tc.download}/>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

const MapStateToProps = (state, props) => {
    return {
        excel: state.excel,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(Excel);

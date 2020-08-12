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
 * @param state.props.type - string - We use this component in different places. <------- ANVÄNDS DETTA?!?!?!?!?!
 */
const Excel = (state) => {
    const [activeSelectors, setActiveSelectors] = useState([]);
    const [hiddenSections, setHiddenSections] = useState([]);

    /*
    Flytta sektioer i rätt ordning. (format högst upp)

    Gör sektioner utfällningsbara.

    När vi gör uttag, döp om de olika til typ getExcelDataList, getExcelDataSupertemp...
    så att vi tar bort proppen dataSource. Vi lägger in olika dataSource i de olika metoderna istället.
    Kom ihåg att skicka med hela activeSelectors.

    Just nu sätter jag bara ny selector när vi klickar på ladda ned, men ska vi spara det till databasen varje gång det klickas i?

    Använd props.type beroende på listor eller prospektera resultat?
     */

    useEffect(() => {
        if (state.excel.activeSelectors) {
            setActiveSelectors(state.excel.activeSelectors);
        }
    }, [state.excel.activeSelectors]);

    useEffect(() => {
        getSavedExcelSelectors();
    }, []);

    const _renderSelectors = () => {
        const sections = [];
        for (const prop in excelHelper.getSelectors()) {
            sections.push(
                <div className='excelWrapper__excel__content__selectors__section'>
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
                        <WidgetFooter save={() => {console.log('Gör uttag')}} saveText={tc.download}/>
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

import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {excelHelper, tc} from 'helpers';
import {convertListsToExcel, getSavedExcelSelectors} from 'store/excel/tasks';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

/**
 * Component used for lists excel download.
 *
 * @param state.props.close - func - Close component
 * @param state.props.selectedLists - array - Lists
 */
const Excel = (state) => {
    const [selectors, setSelectors] = useState(null);
    const [hiddenSections, setHiddenSections] = useState([]);

    useEffect(() => {
        let selectorsToggled = excelHelper.getSelectors();

        // Before rendering selectors, set toggled checkboxes according to saved selectors from previous download.
        // (Selectors are saved with 'label' value rather than 'val' value which isn't optimal, but we'll live with it.)
        if (state.excel.savedSelectors && Array.isArray(state.excel.savedSelectors)) {
            for (const prop in selectorsToggled) {
                if (Array.isArray(selectorsToggled[prop])) {
                    selectorsToggled[prop].map((num) => {
                        num.active = !!(state.excel.savedSelectors.includes(num.label));
                        return num;
                    });
                }
            }
        }

        setSelectors(selectorsToggled);
    }, [state.excel.savedSelectors]);

    useEffect(() => {
        getSavedExcelSelectors();
    }, []);

    const convertToExcel = async () => {
        let selectorsWithActiveValues = selectors;

        // Remove all unactive values and columns that has no active values.
        for (const prop in selectorsWithActiveValues) {
            selectorsWithActiveValues[prop] = selectorsWithActiveValues[prop].filter((num) => num.active);
            if (!selectorsWithActiveValues[prop].length) {
                delete selectorsWithActiveValues[prop];
            }
        }

        // När görs check på om det är tillåtet att ladda ner antal rader? Det sker backend, men vi måste göra något bättre här....
        // Bygg en ny check som kollar detta direkt här..?
        // LÄGG DENNA CHECK DIREKT OCH RENDERA UT FELMEDDELANDE, visa inte ens selektorer om det inte kommer gå att ladda ner.
        // Behöver även kolla på om man har möjlighet till excel, och/eller stora excel.
        // När allt det är klart, kör nedladdning. Kolla var det ska skickas och vad som ska skickas med.
        // Gör bara en för listor just nu. Behöver göra klart hur sökkriterier osv byggs upp innan vi gör den för prospektera/resultat.

        if (typeof state.props.close === 'function') {
            state.props.close();
        }

        return await convertListsToExcel({
            listIds: state.props.selectedLists.map((num) => num._id),
            selectors: selectorsWithActiveValues,
        });
    };

    const _isSectionToggled= (section) => {
        return selectors[section].find((num) => !num.active);
    };

    const _renderSelectors = () => {
        const sections = [];
        let index = 0;
        for (const prop in selectors) {
            index++;
            sections.push(
                <div className='excelWrapper__excel__content__selectors__section' key={index}>
                    <div className='excelWrapper__excel__content__selectors__section__header'>
                        <div className='excelWrapper__excel__content__selectors__section__header__left'>
                            <h4>{excelHelper.getSectionHeading(prop)}</h4>
                            <Icon onClick={() => {
                                    if (hiddenSections.includes(prop)) {
                                        setHiddenSections(hiddenSections.filter((num) => num !== prop));
                                    } else {
                                        setHiddenSections(hiddenSections.concat([prop]));
                                    }
                                }}
                                val={hiddenSections.includes(prop) ? 'rightArrow' : 'downArrow'}s
                            />
                        </div>
                        {(!hiddenSections.includes(prop)) ?
                            <div className='excelWrapper__excel__content__selectors__section__header__right'>
                                <Icon onClick={() => {_toggleSection(prop)}}
                                      val={_isSectionToggled(prop) ? 'checkbox' : 'check'}
                                />
                            </div> : null
                        }
                    </div>
                    {(!hiddenSections.includes(prop)) ?
                        selectors[prop].map((num, i) => {
                            return (
                                <div className={num.active ?
                                    'excelWrapper__excel__content__selectors__section__item__active' :
                                    'excelWrapper__excel__content__selectors__section__item'}
                                     key={i}
                                     onClick={() => {_toggleSelector(prop, num.val)}}
                                >
                                    <Icon val={num.active ? 'check' : 'checkbox'}/>
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

    const _toggleSection = (section) => {
        let selectorsCloned = JSON.parse(JSON.stringify(selectors));

        if (selectorsCloned[section].find((num) => !num.active)) {
            // Toggle all to checked.
            selectorsCloned[section].map((num) => num.active = true);
        } else {
            // Toggle all to unchecked.
            selectorsCloned[section].map((num) => num.active = false);
        }

        setSelectors(selectorsCloned);
    };

    const _toggleSelector = (section, val) => {
        console.log(section);
        console.log(val);
        let selectorsCloned = JSON.parse(JSON.stringify(selectors));

        if (Array.isArray(selectorsCloned[section])) {
            selectorsCloned[section].map((num) => {
                if (num.val === val) {
                    num.active = !num.active;
                }
                return num;
            });

            setSelectors(selectorsCloned);
        }
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
                    {(!!selectors) ?
                        <div className='excelWrapper__excel__content'>
                            <div className='excelWrapper__excel__content__lists'>
                                {`${tc.excelOutput} ${tc.for.toLowerCase()} ${tc.lists.toLowerCase()}:`}
                                {state.props.selectedLists.map((num, i) => {
                                    if (i === state.props.selectedLists.length - 1) {
                                        return <span className='list' key={i}> {num.name}</span>;
                                    } else {
                                        return <span className='list' key={i}> {num.name},</span>
                                    }
                                })}
                            </div>
                            {_renderSelectors()}
                        </div>: <Loading/>
                    }
                    <div className='excelWrapper__excel__footer'>
                        <WidgetFooter save={convertToExcel} saveText={tc.download}/>
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

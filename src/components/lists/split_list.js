import React, {useEffect, useRef, useState} from 'react';
import {tc} from 'helpers';
import Icon from 'components/icon';
import WidgetHeader from 'components/widget_header';
import WidgetFooter from 'components/widget_footer';

/**
 * Component that helps user to split a list.
 * If a user manually adjusts the value for rows, we automatically calculate average value for the other rows.
 *
 * @param props.list
 */
export default (props) => {
    const [info, setInfo] = useState({
        calculatedInput: props.list.total,
        manualInput: 0,
        text: 'För att klyva till fler listor, klicka på Lägg till rad. Det går att justera antal för varje lista manuellt.',
        validated: true,
    });
    const [splits, setSplits] = useState([]);
    const [touched, setTouched] = useState([]); // Indexes of splits where user have adjusted the amount.
    const splitListAmountInputRefs = useRef([]);
    const splitListNameInputRefs = useRef([]);

    const _calculateSplits = (payload) => {
        let splitsCopy = splits.slice();
        let touchedCopy = touched.slice();

        if (payload.add) {
            // Add split.
            splitsCopy.push({
                amount: 0,
                name: props.list.name + ' ' + (splitsCopy.length + 1),
            });
        } else if (payload.remove) {
            // Remove split.
            splitsCopy = splitsCopy.filter((split, i) =>  i !== payload.index);
            touchedCopy = touchedCopy.filter((num) => num !== payload.index);
        } else if (payload.amountChange) {
            // User have adjusted a split manually.
            if (!touchedCopy.includes(payload.index)) {
                touchedCopy.push(payload.index);
            }
            splitsCopy.map((split, i) => {
                if (i === payload.index) {
                    split.amount =  Math.floor(+splitListAmountInputRefs.current[payload.index].value);
                }
                return split;
            });
        }

        // Total of manually adjusted.
        let amountTouched = 0;
        splitsCopy.forEach((split, i) => {
            if (touchedCopy.includes(i)) {
                amountTouched = amountTouched + split.amount;
            }
        });

        // New total to be calculated.
        const newTotalCalculate = props.list.total - amountTouched;

        // Calculated split value.
        const amountCalculatedSplits = splitsCopy.length - touchedCopy.length;

        // Dont add rows when there isn't enough prospects.
        if (newTotalCalculate / amountCalculatedSplits < 1) {
            return setInfo({
                ...info,
                text: 'Kan inte addera fler rader än det finns prospekt'
            });
        }

        // Calculate splits.
        let count = 0;
        const newSplits = splitsCopy.map((split, i) => {
            if (i === splitsCopy.length - 1) {
                let amount = (props.list.total - count < 0) ? 0 : (props.list.total - count);
                if (amount > props.list.total) {
                    amount = props.list.total;
                } else if (amount < 0) {
                    amount = 0;
                }
                count = count + amount;
                // Last one, add the rest.
                return {
                    amount: amount,
                    name: split.name,
                };
            } else if (touchedCopy.includes(i)) {
                // Been touched, do not adjust.
                let amount = split.amount < 0 ? 0 : split.amount;
                if (amount > props.list.total - 1) {
                    amount = props.list.total - 1;
                }
                count = count + amount;
                return {
                    amount: amount,
                    name: split.name,
                };
            } else {
                let amount = (Math.floor(newTotalCalculate / amountCalculatedSplits) < 0) ? 0 : Math.floor(newTotalCalculate / amountCalculatedSplits);
                if (amount > props.list.total) {
                    amount = props.list.total;
                }
                count = count + amount;
                return {
                    amount: amount,
                    name: split.name,
                };
            }
        });

        setInfo({
            text: (props.list.total - count === 0) ?
                'Prospekt är jämnt är fördelade.' :
                'Prospekt är inte jämnt fördelade, justera antal eller lägg till ny rad.',
            validated: (props.list.total - count === 0),
        });

        setTouched(touchedCopy);
        return setSplits(newSplits);
    };

    const _addSplit = () => {
        if (props.list.total === splits.length) {
            return setInfo({
                ...info,
                text: 'Kan inte addera fler rader än det finns prospekt',
            });
        }

        return _calculateSplits({add: true});
    };

    const _onAmountInputChange = (index) => {
        if (Math.floor(+splitListAmountInputRefs.current[index].value) > props.list.total -1) {
            return setInfo({
                ...info,
                text: 'Kan inte sätta så högt värde för enskild lista.'
            });
        }
        return _calculateSplits({amountChange: true, index: index});
    };

    const _onNameInputChange = (index) => {
        if (!splitListNameInputRefs.current[index].value.length) {
            return setInfo({
                ...info,
                text: 'Namn kan ej vara tomt'
            });
        }
        setSplits(splits.map((split, i) => {
            if (i === index) {
               split.name =  splitListNameInputRefs.current[index].value;
            }
            return split;
        }));
    };

    const _removeSplit = (index) => {
        if (splits.length === 2) {
            return setInfo({
                ...info,
                text: tc.cannotSplitLessThanTwo,
            });
        }

        return _calculateSplits({index: index, remove: true});
    };

    const _renderSplitRows = () => {
        if (splits && splits.length) {
            return splits.map((split, i) => {
                return (
                    <div className='splitListWrapper__splitList__content__row' key={i + 1}>
                        <div className='splitListWrapper__splitList__content__row__amount'>
                            <input disabled={i === splits.length - 1}
                                   onChange={() => {_onAmountInputChange(i)}}
                                   ref={(el) => (splitListAmountInputRefs.current[i] = el)}
                                   type='text'
                                   value={split.amount}
                            />
                        </div>
                        <div className='splitListWrapper__splitList__content__row__touched'><Icon active={touched.includes(i)} val='check'/></div>
                        <div className='splitListWrapper__splitList__content__row__name'>
                            <input onChange={() => {_onNameInputChange(i)}}
                                   ref={(el) => (splitListNameInputRefs.current[i] = el)}
                                   type='text'
                                   value={split.name}
                            />
                        </div>
                        <div className='splitListWrapper__splitList__content__row__remove'><Icon active={i > 1} val='remove' onClick={() => {_removeSplit(i)}}/></div>
                    </div>
                );
            });
        }
    };

    useEffect(() => {
        if (props.list) {
            setSplits([
                {
                    amount: Math.round(+props.list.total / 2),
                    name: props.list.name + ' 1',
                },
                {
                    amount: Math.round(+props.list.total / 2),
                    name: props.list.name + ' 2',
                },
            ]);
        }
    }, [props.list]);

    return (
        <div className='splitListWrapper'>
            <div className='splitListWrapper__splitList'>
                <div className='splitListWrapper__splitList__header'>
                    <WidgetHeader
                        iconVal='split'
                        headline={tc.splitList}
                    />
                </div>
                <div className='splitListWrapper__splitList__content'>
                    <div className='splitListWrapper__splitList__content__info'>
                        <p>Text: {info.text}</p>
                        <p>{tc.amountProspects}: {props.list.total}</p>
                    </div>
                    <div className='splitListWrapper__splitList__content__row'>
                        <div className='splitListWrapper__splitList__content__row__amount'>{tc.amount}</div>
                        <div className='splitListWrapper__splitList__content__row__touched'>{tc.adjusted}</div>
                        <div className='splitListWrapper__splitList__content__row__name'>{tc.listName}</div>
                        <div className='splitListWrapper__splitList__content__row__remove'>{tc.remove}</div>
                    </div>
                    {_renderSplitRows()}
                    <div className='splitListWrapper__splitList__content__addRow' onClick={_addSplit}>{tc.addRow}</div>
                </div>
                <div className='splitListWrapper__splitList__footer'>
                    <WidgetFooter save={() => {
                        if (!info.validated) {
                            return setInfo({
                                ...info,
                                text: 'Prospekt behöver vara jämt fördelade för att spara. Justera antal eller lägg till ny rad.'
                            });
                        } else if (props.save === 'function') {
                            return props.save(splits);
                        }
                    }}
                    />
                </div>
            </div>
        </div>
    );
};

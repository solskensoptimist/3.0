import React, {useEffect, useRef, useState} from 'react';
import {tc} from 'helpers';
import Icon from 'components/icon';
import Info from 'components/info';
import WidgetHeader from 'components/widget_header';
import WidgetFooter from 'components/widget_footer';

/**
 * Component that helps user to split a list.
 * If a user manually adjusts the value for rows, we automatically calculate average value for the other rows.
 *
 * @param props.list - object - The list
 * @param props.save - func - Here we return the list splits.
 */
export default (props) => {
    const [info, setInfo] = useState({
        hint: (props.list.total > 1) ? '' : tc.tooFewProspectsInList,
        validated: true,
    });
    const [splits, setSplits] = useState([]);
    const [touched, setTouched] = useState([]); // Indexes of splits where user have manually adjusted the size.
    const splitListAmountInputRefs = useRef([]);
    const splitListNameInputRefs = useRef([]);

    useEffect(() => {
        if (props.list && props.list.total > 1) {
            setSplits([
                {
                    size: Math.floor(props.list.total / 2),
                    name: props.list.name + ' 1',
                },
                {
                    size: props.list.total - (Math.floor(+props.list.total / 2)),
                    name: props.list.name + ' 2',
                },
            ]);
        }
    }, [props.list]);

    const _calculateSplits = (payload) => {
        let splitsCopy = splits.slice();
        let touchedCopy = touched.slice();
        let amountTouched = 0; // Total of manually adjusted.

        if (payload.add) {
            // Add split.
            splitsCopy.push({
                size: 0,
                name: props.list.name + ' ' + (splitsCopy.length + 1),
            });

            // Calculate sum of manually adjusted.
            splitsCopy.forEach((split, i) => {
                if (touchedCopy.includes(i)) {
                    amountTouched = amountTouched + split.size;
                }
            });
        } else if (payload.remove) {
            // Remove split.
            splitsCopy = splitsCopy.filter((split, i) =>  i !== payload.index);
            touchedCopy = touchedCopy.filter((num) => num !== payload.index);

            // Calculate sum of manually adjusted.
            splitsCopy.forEach((split, i) => {
                if (touchedCopy.includes(i)) {
                    amountTouched = amountTouched + split.size;
                }
            });
        } else if (payload.amountChange) {
            // User have adjusted a split manually.
            if (!touchedCopy.includes(payload.index)) {
                touchedCopy.push(payload.index);
            }

            // Calculate sum of manually adjusted...
            splitsCopy.forEach((split, i) => {
                if (touchedCopy.includes(i) && i !== payload.index) {
                    amountTouched = amountTouched + split.size;
                }
            });
            // ...and add current input value to sum.
            amountTouched = amountTouched + payload.value;

            // Value too high, stop.
            if ((amountTouched > props.list.total) ||
                (amountTouched > (props.list.total - 1) && splitsCopy.length > touchedCopy.length)) {
                return setInfo({
                    ...info,
                    hint: tc.valueTooHigh,
                });
            }

            // Set current input value to correct split.
            splitsCopy.map((split, i) => {
                if (i === payload.index) {
                    split.size =  payload.value;
                }
                return split;
            });
        }

        // Set indexes of manually touched splits.
        setTouched(touchedCopy);

        // New total to use for automatic calculation.
        const newTotalCalculate = props.list.total - amountTouched;

        // Calculated value for splits that isn't manually adjusted.
        let amountCalculatedSplits = splitsCopy.length - touchedCopy.length;

        // If there isn't enough to give each split size >= 1, remove splits until this is true.
        if (newTotalCalculate / amountCalculatedSplits < 1) {
            const removeAmountCalculatedSplits = () => {
                if (amountCalculatedSplits === 0) {
                    return;
                }
                splitsCopy.pop();
                amountCalculatedSplits = amountCalculatedSplits - 1;
                if (newTotalCalculate / amountCalculatedSplits < 1) {
                    removeAmountCalculatedSplits();
                }
            };
            removeAmountCalculatedSplits();
            return setInfo({
                ...info,
                hint: tc.valuesAndListsDontAddUp,
            });
        }

        // Calculate splits.
        let count = 0;
        const newSplits = splitsCopy.map((split, i) => {
            if (i === splitsCopy.length - 1) {
                let size = (props.list.total - count < 0) ? 0 : (props.list.total - count);
                if (size > props.list.total) {
                    size = props.list.total;
                } else if (size < 0) {
                    size = 0;
                }
                count = count + size;
                // Last one, add the rest.
                return {
                    size: size,
                    name: split.name,
                };
            } else if (touchedCopy.includes(i)) {
                // Been touched, do not adjust.
                let size = split.size < 0 ? 0 : split.size;
                if (size > props.list.total - 1) {
                    size = props.list.total - 1;
                }
                count = count + size;
                return {
                    size: size,
                    name: split.name,
                };
            } else {
                let size = (Math.floor(newTotalCalculate / amountCalculatedSplits) < 0) ? 0 : Math.floor(newTotalCalculate / amountCalculatedSplits);
                if (size > props.list.total) {
                    size = props.list.total;
                }
                count = count + size;
                return {
                    size: size,
                    name: split.name,
                };
            }
        });

        setInfo({
            hint: '',
            validated: (props.list.total - count === 0), // Should always be true, extra safe catch just in case.
        });

        return setSplits(newSplits);
    };

    const _addSplit = () => {
        if (props.list.total === splits.length) {
            return setInfo({
                ...info,
                hint: tc.cannotAddMoreListsThanProspects,
            });
        }

        return _calculateSplits({add: true});
    };

    const _onAmountInputChange = (index) => {
        if (Math.floor(+splitListAmountInputRefs.current[index].value) > props.list.total -1) {
            return setInfo({
                ...info,
                hint: tc.valueTooHigh
            });
        }
        let inputValue = 0;
        if (splitListAmountInputRefs.current[index] && splitListAmountInputRefs.current[index].value) {
            inputValue = Math.floor(+splitListAmountInputRefs.current[index].value) > (props.list.total - 1) ?
                (props.list.total - 1) :
                Math.floor(+splitListAmountInputRefs.current[index].value);
        }

        return _calculateSplits({
            amountChange: true,
            index: index,
            value: inputValue,
        });
    };

    const _onNameInputChange = (index) => {
        if (!splitListNameInputRefs.current[index].value.length) {
            return setInfo({
                ...info,
                hint: tc.nameCannotBeEmpty,
            });
        } else {
            setInfo({
                ...info,
                hint: '',
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
                hint: tc.cannotSplitLessThanTwo,
            });
        }

        return _calculateSplits({index: index, remove: true});
    };

    const _renderSplitRows = () => {
        if (splits && splits.length) {
            return splits.map((split, i) => {
                return (
                    <div className='splitListWrapper__splitList__content__row' key={i + 1}>
                        <div className='splitListWrapper__splitList__content__row__size'>
                            <input disabled={i === splits.length - 1}
                                   onChange={() => {_onAmountInputChange(i)}}
                                   ref={(el) => (splitListAmountInputRefs.current[i] = el)}
                                   type='text'
                                   value={split.size}
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
                    {props.list.total > 1 ?
                        <div className='splitListWrapper__splitList__content__info'>
                            <p><span className='label'>{tc.list}:</span><span>{props.list.name}</span></p>
                            <p><span className='label'>{tc.amountProspects}:</span><span>{props.list.total} {tc.aPiece.toLowerCase()}</span></p>
                        </div> : null
                    }
                    {info.hint.length ?
                        <Info>
                            <h4>{tc.thereWasAProblem}</h4>
                            <p>{info.hint}</p>
                        </Info> : null
                    }
                    {props.list.total > 1 ?
                        <>
                            <div className='splitListWrapper__splitList__content__row'>
                                <div className='splitListWrapper__splitList__content__row__size light'>{tc.amount}</div>
                                <div className='splitListWrapper__splitList__content__row__touched light'>{tc.adjusted}</div>
                                <div className='splitListWrapper__splitList__content__row__name light'>{tc.listName}</div>
                                <div className='splitListWrapper__splitList__content__row__remove light'>{tc.remove}</div>
                            </div>
                            {_renderSplitRows()}
                            <div className='splitListWrapper__splitList__content__addRow' onClick={_addSplit}>{tc.addRow}</div>
                        </> : null
                    }
                </div>
                {props.list.total > 1 ?
                    <div className='splitListWrapper__splitList__footer'>
                        <WidgetFooter save={() => {
                                if (!info.validated) {
                                    // Should never happen, extra safe catch just in case.
                                    return setInfo({
                                        ...info,
                                        hint: tc.splitListInfo,
                                    });
                                } else if (typeof props.save === 'function') {
                                    return props.save(splits);
                                }
                            }}
                        />
                    </div> : null
                }
            </div>
        </div>
    );
};

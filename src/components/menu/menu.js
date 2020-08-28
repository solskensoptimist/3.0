import React, {useEffect, useState} from 'react';
import {Dropdown, DropdownItem} from 'components/dropdown';
import Icon from 'components/icon';

/**
 * Render a item_menu with items, or a navigational item_menu with a sub item_menu that holds items.
 * Item object types can be: 'button' | 'dropdown' | 'nav'.
 * Type 'nav' can have a children array with items that is rendered in its own sub item_menu.
 * Type 'nav' needs a unique id property and this type should not show up in its own children array.
 * Possibility exists to provide an icon to item.
 * Possibility exists to provide a 'disabled' property for buttons that will be shown, but disabled.
 *
 * Note that you can display dropdowns with or without checkboxes.
 *
 * @param props.items - array - Example: [
 *      {
 *          id: 1,
 *          children: [
 *              {label: 'My button 1', onClick: func, type: 'button'},
 *              {label: 'My dropdown', items: [{label: 'Dropdownitem 1', onClick: func}, {label: 'Dropdownitem 2', onClick: func}], type: 'dropdown',},
 *          ],
 *          label: 'Menu option 1',
 *          onClick: func,
 *          type: 'nav',
 *      },
 *      {
 *          id: 2,
 *          children: [
 *              {label: 'My button 1', onClick: func, type: 'button'},
 *              {label: 'My dropdown', items: [{label: 'Dropdownitem 1', onClick: func}, {label: 'Dropdownitem 2', onClick: func}], type: 'dropdown', checkboxes: true,},
 *          ],
 *          label: 'Menu option 2',
 *          onClick: func,
 *          type: 'nav',
 *      },
 *      {
 *          label: 'Menu option 3',
 *          onClick: func,
 *          type: 'button',
 *      },
 * ]
 */
export default (props) => {
    const [activeId, setActiveId] = useState((props.items && props.items.length && props.items.find((num) => num.active)) ? props.items.find((num) => num.active).id : null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (props.items.length) {
            setItems(props.items.sort((a, b) => {
                if ( a.label < b.label){
                    return -1;
                } else if ( a.label > b.label ){
                    return 1;
                } else {
                    return 0;
                }
            }));
        }

        props.items.map((num) => {
            if (num.children) {
                num.children.sort((a, b) => {
                    if ( a.label < b.label){
                        return -1;
                    } else if ( a.label > b.label ){
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            return num;
        });

    }, [props.items]);

    const _renderItems = (arr, main) => {
        return arr.map((num, i) => {
            if (num.type === 'button') {
                return (
                    <div className={num.disabled ? 'menuItem__disabled' : 'menuItem'}
                         onClick={() => {
                             if (!num.disabled && typeof num.onClick === 'function') {
                                 num.onClick();
                             }
                             if (main) {
                                 setActiveId(null);
                             }
                         }}
                         key={i}>
                        {main && <span className='listBullet'>&#8226;</span>}
                        {num.label}
                        {num.icon ? <Icon val={num.icon}/> : null}
                    </div>
                );
            } else if (num.type === 'dropdown') {
                return (
                    <div className={num.disabled ? 'menuItem__disabled' : 'menuItem'}
                         onClick={() => {
                             if (main) {
                                 setActiveId(null);
                             }
                         }}
                         key={i}
                    >
                        {num.disabled ?
                            <>
                                {main && <span className='listBullet'>&#8226;</span>}
                                {num.label}
                            </>
                            :
                            <>
                                <span className='listBullet'>&#8226;</span>
                                <Dropdown displayValue={num.label}>
                                    {num.items.map((item, i) => {
                                        return(
                                            <DropdownItem
                                                active={item.active}
                                                key={i}
                                                hideCheckbox={!num.checkboxes}
                                                label={item.label}
                                                onClick={item.onClick}
                                            />
                                        );
                                    })}
                                </Dropdown>
                                {num.icon ? <Icon val={num.icon}/> : null}
                            </>
                        }
                    </div>
                );
            } else if (main && num.type === 'nav') {
                let className;
                if (num.disabled) {
                    className = 'menuItem__disabled';
                } else if (!num.disabled && num.id === activeId) {
                    className = 'menuItem__active';
                } else {
                    className = 'menuItem';
                }
                return (
                    <div className={className}
                         onClick={() => {
                             if (!num.disabled && typeof num.onClick === 'function') {
                                 num.onClick();
                             }
                             setActiveId(num.id)}
                         }
                         key={i}
                    >
                        <span className='listBullet'>&#8226;</span>
                        {num.label}
                        {num.icon ? <Icon val={num.icon}/> : null}
                    </div>
                );
            } else {
                return null;
            }
        })
    };

    const _renderMain = () => {
        if (items.length) {
            return (
                <div className='menuWrapper__menu__main'>
                    {_renderItems(items, true)}
                </div>
            );
        }
    };

    const _renderSub = () => {
        const activeItem = items.find((num) => num.id === activeId);
        if (activeItem && activeItem.children && activeItem.children.length) {
            return (
                <div className='menuWrapper__menu__sub'>
                    {_renderItems(activeItem.children, false)}
                </div>
            );
        }
    };

    return (
        <div className='menuWrapper'>
            <div className='menuWrapper__menu'>
                {_renderMain()}
                {_renderSub()}
            </div>
        </div>
    );
}

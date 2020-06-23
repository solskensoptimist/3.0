import React from 'react';
import {Dropdown, DropdownItem} from 'components/dropdown';
import Icon from 'components/icon';

/**
 * Render a menu with items.
 * Define if items is buttons, dropdown etc.
 * Note that items can have optional icon value.
 *
 * @param props.items - array - Example: [
 *      {
 *          icon: 'mail',
 *          label: 'Label 1',
 *          items: [{label: 'Menuitem 1', onClick: func}, {label: 'Menuitem 2', onClick: func}],
 *          type: 'dropdown',
 *      },
 *      {
 *          icon: 'user',
 *          label: 'Label 2',
 *          onClick: func,
 *          type: 'button',
 *      }
 * ]
 */
export default (props) => {
    const _renderItems = () => {
        if (props.items && props.items.length) {
            return props.items.map((num) => {
                if (num.type === 'button') {
                    return (
                        <div className='menuWrapper__menu__item'>
                            <div className='menuWrapper__menu__item__button' onClick={num.onClick}>
                                {num.icon ? <Icon val={num.icon}/> : null}
                                {num.label}
                            </div>
                        </div>
                    );
                } else if (num.type === 'dropdown') {
                    return (
                        <div className='menuWrapper__menu__item'>
                            {num.icon ? <Icon val={num.icon}/> : null}
                            <Dropdown displayValue={num.label} positionRight={true}>
                                {num.items.map((item, i) => {
                                    return(
                                        <DropdownItem
                                            key={i}
                                            label={item.label}
                                            onClick={item.onClick}
                                        />
                                    );
                                })}
                            </Dropdown>
                        </div>
                    );
                } else {
                    return null;
                }
            });
        }
    };

    return (
        <div className='menuWrapper'>
            <div className='menuWrapper__menu'>
                {_renderItems()}
            </div>
        </div>
    );
}

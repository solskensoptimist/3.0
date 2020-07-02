import React from 'react';
import {Dropdown, DropdownItem} from 'components/dropdown';
import Icon from 'components/icon';

/**
 * Render a menu with items.
 * Define if items is buttons, dropdown etc.
 * Note that possibility exists to add an icon to item.
 * Also note that you can provide a 'disabled' property for buttons that will be shown, but disabled.
 *
 * @param props.items - array - Example: [
 *      {
 *          disabled: true,
 *          label: 'My dropdown',
 *          items: [{label: 'Dropdownitem 1', onClick: func}, {label: 'Dropdownitem 2', onClick: func}],
 *          type: 'dropdown',
 *      },
 *      {
 *          icon: 'navigate',
 *          label: 'Listprenumerationer',
 *          onClick: func,
 *          type: 'button',
 *      }
 * ]
 */
export default (props) => {
    const _renderItems = () => {
        if (props.items && props.items.length) {
            return props.items.map((num, i) => {
                if (num.type === 'button') {
                    return (
                        <div className={num.disabled ? 'menuWrapper__menu__item__disabled' : 'menuWrapper__menu__item'} onClick={num.disabled ? null : num.onClick} key={i}>
                            <span className='listBullet'>&#8226;</span>
                            {num.label}
                            {num.icon ? <Icon val={num.icon}/> : null}
                        </div>
                    );
                } else if (num.type === 'dropdown') {
                    return (
                        <div className={num.disabled ? 'menuWrapper__menu__item__disabled' : 'menuWrapper__menu__item'} key={i}>
                            {num.disabled ?
                                <>
                                    <span className='listBullet'>&#8226;</span>
                                    {num.label}
                                </>
                            :
                                <>
                                    <span className='listBullet'>&#8226;</span>
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
                                    {num.icon ? <Icon val={num.icon}/> : null}
                                </>
                            }
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

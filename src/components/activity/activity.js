import React, {useEffect} from 'react';
import {getActivity} from 'store/activity/tasks';
import Activities from 'components/activities';
import Events from 'components/events';
import Menu from 'components/menu';

export default () => {
    const _minKnapp = () => {
        console.log('Min knapp klickades');
    };

    const _mittDropdownItem = () => {
        console.log('Mitt dropdownitem klickades');
    };

    useEffect(() => {
        getActivity({type: 'filter'});
    });

    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                <div className='activityWrapper__activity__header'>
                    <Menu items={[
                        {label: 'Min knapp', onClick:_minKnapp, type: 'button'},
                        {label: 'Min dropdown', type: 'dropdown', items: [
                                {label: 'Dropdownitem 1', onClick: _mittDropdownItem},
                                {label: 'Dropdownitem 2', onClick: _mittDropdownItem},
                                {label: 'Dropdownitem 3', onClick: _mittDropdownItem},
                            ]}
                    ]}
                    />
                </div>
                <div className='activityWrapper__activity__content'>
                    <p>
                        Här ska vi också rendera alla sparade pipeline widgets som finns i dashboard settings. Vi har tagit bort dom från förstasidan...?
                    </p>
                    <div className='activityWrapper__activity__content__item'>
                        <Events type='filter' view='flow' />
                    </div>
                    <div className='activityWrapper__activity__content__item'>
                        <Activities includeMoved={true} type='filter' />
                    </div>
                </div>
            </div>
        </div>
    );
}

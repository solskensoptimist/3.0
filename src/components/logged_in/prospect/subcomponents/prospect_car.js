import React  from 'react';
import {ProspectSub} from './prospect_sub';
import {tc} from 'helpers';

export const ProspectCar = () => {
    return (
        <div>
            {tc.prospect} bilkomponent
            <ProspectSub />
        </div>
    );
};

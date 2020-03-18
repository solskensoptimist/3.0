import React from 'react';
import {userLogin} from 'store/user/tasks';
import tc from 'text_content';

export default () =>  {
    const handleSubmit = async () => {
        await userLogin({
            email: 'peter.persson@bilvision.se',
            password: 'ninja',
        });
    };

    return (
        <div>
            <div onClick={handleSubmit}>
                <button>{tc.logon}</button>
            </div>
        </div>
    );
}

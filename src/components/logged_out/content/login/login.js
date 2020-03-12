import React from 'react';
import {userLogin} from 'store/user/tasks';
import tc from 'text_content';

export default () =>  {
    const handleSubmit = async () => {
        await userLogin({
            email: 'peter.persson@bilvision.se',
            password: 'ninja',
        });
        window.location.href = '/';
    };

    return (
        <div>
            <div onClick={handleSubmit}>
                {tc.logon}
            </div>
        </div>
    );
}

import React from 'react';
import {userLogin} from 'store/user/tasks';

export default () =>  {
    const handleSubmit = async () => {
        await userLogin({
            email: 'peter.persson@bilvision.se',
            password: 'ninja',
        });
        window.location.href = '/bearbeta';
    };

    return (
        <div>
            <div onClick={handleSubmit}>
                Klicka här för att logga in.
            </div>
        </div>
    );
};

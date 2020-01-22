import React from 'react';
import {userLogin} from 'store/user/tasks';

export const LoginComponent = () =>  {
    const handleSubmit = async () => {
        await userLogin({
            email: 'peter.persson@bilvision.se',
            password: 'ninja',
        });
    };

    return (
        <div>
            <div onClick={handleSubmit}>
                Klicka här för att logga in.
            </div>
        </div>
    );
};

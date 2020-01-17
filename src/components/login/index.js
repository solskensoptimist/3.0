import React from 'react';
import {userLogin} from 'store/user/tasks';

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit() {
        await userLogin({
            email: 'peter.persson@bilvision.se',
            password: 'ninja',
        });
    }

    render() {
        return (
            <div>
                <div onClick={this.handleSubmit}>
                    Klicka här för att logga in.
                </div>
            </div>
        );
    }
}

export {LoginComponent};

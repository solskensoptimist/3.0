import React, {useRef} from 'react';
import {userLogin} from 'store/user/tasks';
import {tc} from 'helpers';

export default () =>  {
    const emailRef = useRef();
    const pwRef = useRef();

    const handleSubmit = async () => {
        const email = (emailRef && emailRef.current && emailRef.current.value) ? emailRef.current.value : '';
        const pw = (pwRef && pwRef.current && pwRef.current.value) ? pwRef.current.value : '';

        await userLogin({
            email: email,
            password: pw,
        });
    };

    return (
        <div className='loginWrapper'>
            <div className='loginWrapper__login'>
                <input ref={emailRef} type='text'/>
                <input ref={pwRef} type='password'/>
                <button onClick={handleSubmit}>{tc.logon}</button>
            </div>
        </div>
    );
}

import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';
import {tc} from "helpers";

/**
 * Render person view.
 */
const Person = (state) => {
    // const [emails, setEmails] = useState([]);
    const [minimize, setMinimize] = useState(false);
    // const [currentEmailEdit, setCurrentEmailEdit] = useState(null);
    // const [currentPhoneEdit, setCurrentPhoneEdit] = useState(null);
    // const [phoneNumbers, setPhoneNumbers] = useState([]);
    // const companyInfoEmailsInputRefs = useRef([]);
    // const companyInfoPhoneInputRefs = useRef([]);

    const _stateCheck = () => {
        return !!(state && state.person && state.person.person);
    };

    return (_stateCheck() ?
            <div className='personInfoWrapper'>
                <div className='personInfoWrapper__personInfo'>
                    <div className='personInfoWrapper__personInfo__header'>
                        <WidgetHeader
                            iconVal='person'
                            dashboard={
                                minimize ?
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                    </> :
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    </>
                            }
                            headline={tc.info}
                            headlineSub={tc.personInfo}
                        />
                    </div>
                    <div className='personInfoWrapper__personInfo__content'>
                        Person info
                    </div>
                </div>
            </div> :
            <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        person: state.person,
    };
};

export default connect(
    MapStateToProps,
)(Person);

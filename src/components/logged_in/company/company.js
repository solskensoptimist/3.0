import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import Activities from 'components/logged_in/activities';
import Comment from 'components/logged_in/comment';
import Contacts from 'components/logged_in/contacts';
import Events from 'components/logged_in/events';
import Loading from 'components/shared/loading';
import Icon from 'components/shared/icon';
import Popup from 'components/shared/popup';
import Tooltip from 'components/shared/tooltip/tooltip';

const Company = (state) => {
    let {id} = useParams();

    return (
        <div className='companyWrapper'>
            <div className='companyWrapper__company'>
                <div className='companyWrapper__company__header'>
                    header
                </div>
                <div className='companyWrapper__company__content'>
                    <p>Företagskomponent</p>
                    <p>Id: {id}</p>
                    <p>Här ska vi hämta kontakter för detta företag, det innebär att vi hämtar kontakter på companyId.
                    Det kan finnas kontatketr som har entityId som ett regnr, men companyId är företag. Alla dessa ska
                    givetvis hämtas också. Anropar vi bara getContacts med ''entityId' som är orgnr, så ska det lösa sig.
                    Bara låter detta ligga kvar som en påminnelse.</p>
                    <p>Varje gång som vi sparar en kontakt för ett företag så ska vi skicka med entityName: företagsnamn.</p>
                    <div className='companyWrapper__company__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Activities includeComments={true} includeMoved={true} target={id} type='target'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        company: state.company,
    };
};

export default connect(
    MapStateToProps,
)(Company);


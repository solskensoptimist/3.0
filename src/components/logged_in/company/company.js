import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCompany} from 'store/company/tasks';
import Activities from 'components/logged_in/activities';
// import Comment from 'components/logged_in/comment';
import Contacts from 'components/logged_in/contacts';
import CompanyInfo from './company_info';
import Events from 'components/logged_in/events';
import Fleet from 'components/logged_in/fleet';
import Loading from 'components/shared/loading';
// import Icon from 'components/shared/icon';
// import Popup from 'components/shared/popup';
// import Tooltip from 'components/shared/tooltip/tooltip';

const Company = (state) => {
    const {id} = useParams();

    const _stateCheck = () => {
        return (state && state.company && state.company.company && Object.keys(state.company.company).length);
    };

    useEffect(() => {
        getCompany({id: id});
    }, [id]);

    return ( _stateCheck() ?
        <div className='companyWrapper'>
            <div className='companyWrapper__company'>
                <div className='companyWrapper__company__header'>
                    header
                </div>
                <div className='companyWrapper__company__content'>
                    <p>Företagskomponent</p>
                    <p>Kolla att vi får fram kontakter som sparats med entityid ett regnr och companyId som är detta org nr.</p>
                    <p>Till kontakter ska vi även skicka in entityName='state.company.name' när vi har detta i store.</p>
                    <p>Här ska vi hämta kontakter för detta företag, det innebär att vi hämtar kontakter på companyId.
                    Det kan finnas kontatketr som har entityId som ett regnr, men companyId är företag. Alla dessa ska
                    givetvis hämtas också. Anropar vi bara getContacts med ''entityId' som är orgnr, så ska det lösa sig.
                    Bara låter detta ligga kvar som en påminnelse.</p>
                    <p>Varje gång som vi sparar en kontakt för ett företag så ska vi skicka med entityName: företagsnamn.</p>
                    <div className='companyWrapper__company__content__item'>
                        <Events target={id} type='target' view='flow'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <CompanyInfo/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Contacts entityId={id}  entityName={state.company.company.name} entityType='company'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Fleet type='current'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Fleet type='historic'/>
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Activities includeComments={true} includeMoved={true} target={id} type='target'/>
                    </div>
                </div>
            </div>
        </div> :
        <Loading />
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


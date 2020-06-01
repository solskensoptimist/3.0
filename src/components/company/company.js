import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCompany} from 'store/company/tasks';
import Activities from 'components/activities';
// import Comment from 'components/comment';
import Contacts from 'components/contacts';
import CompanyInfo from './company_info';
import Events from 'components/events';
import Fleet from 'components/fleet';
import Loading from 'components/loading';
// import Icon from 'components/icon';
// import Popup from 'components/popup';
// import Tooltip from 'components/tooltip';

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
                    <p>Vill vi att alla kontakter för alla affärer som detta företag ingår i ska visas, eller bara kontakter där entityId är detta orgnr?</p>
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
                        <Fleet prospectId={state.company.company.user_id} />
                    </div>
                    <div className='companyWrapper__company__content__item'>
                        <Fleet historic={true} prospectId={state.company.company.user_id} />
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


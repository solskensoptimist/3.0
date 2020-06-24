import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getDashboardSettings} from 'store/settings/tasks';
import Events from 'components/events';
import LeadsWidget from 'components/leads_widget';
import News from 'components/news';
import SupertempWidget from 'components/supertemp_widget';

const Dashboard = (state) => {
    const [widgets, setWidgets] = useState([]);

    /*
    Ha en funktion som gör att en widget hoppar upp eller ner ett steg.. detta påverkar positionen för den.
    Behöver ny endpoint i backend för detta troligtvis..?
    Ska vi visa upp pipeline widgets här..?
    Hur ska de kunna ändra position, var ska knappen finnas? En undermeny?
     */


    const _renderWidget = (widget, i) => {
        switch (widget.type.toLowerCase()) {
            case 'notifications':
                return  (
                    <div className='dashboardWrapper__dashboard__content__item' key={i}>
                        <Events small={true} type='all' view='calendar'/>
                    </div>
                );
            case 'leads':
                return (
                    <div className='dashboardWrapper__dashboard__content__item' key={i}>
                        <LeadsWidget/>
                    </div>
                );
            case 'monitorlist':
                return (
                    <div className='dashboardWrapper__dashboard__content__item' key={i}>
                        <SupertempWidget {...widget}/>
                    </div>
                );
            case 'news':
                return (
                    <div className='dashboardWrapper__dashboard__content__item' key={i}>
                        <News/>
                    </div>
                );
            default:
                return null;
        }
    };

    const _renderWidgetsLeft = () => {
        return widgets.map((widget, i) => {
            if (i % 2 === 0) {
                return _renderWidget(widget, i);
            } else {
                return null;
            }
        });
    };

    const _renderWidgetsRight = () => {
        return widgets.map((widget, i) => {
            if (i % 2 !== 0) {
                return _renderWidget(widget, i);
            } else {
                return null;
            }
        });
    };

    useEffect(() => {
        getDashboardSettings();
    }, []);

    useEffect(() => {
        // We dont show pipeline widgets on dashboard anymore.
        const data = state.settings.dashboard.data.filter((num) => num.type !== 'pipeline');

        setWidgets(data);
    }, [state.settings.dashboard]);

    return (
        <div className='dashboardWrapper'>
            <div className='dashboardWrapper__dashboard'>
                <div className='dashboardWrapper__dashboard__content'>
                    <div className='dashboardWrapper__dashboard__content__left'>
                        {_renderWidgetsLeft()}
                    </div>
                    <div className='dashboardWrapper__dashboard__content__right'>
                        {_renderWidgetsRight()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        settings: state.settings,
    };
};

export default connect(
    MapStateToProps,
)(Dashboard);

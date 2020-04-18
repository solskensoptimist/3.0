import React from 'react';
import {
    AttachMoney,
    Assignment,
    BarChart,
    Edit,
    ExitToApp,
    Group,
    History,
    Home,
    List,
    NavigateBefore,
    NavigateNext,
    Reorder,
    Search,
    TrendingUp,
    Today,
    ToggleOff,
    ToggleOn,
    Tune,
    Work
} from '@material-ui/icons';

export const iconHelper = {
    getIcon:(val) => {
        switch (val) {
            case 'activity':
                return <TrendingUp/>;
            case 'agile':
                return <Assignment/>;
            case 'analyze':
                return <BarChart/>;
            case 'edit':
                return <Edit/>;
            case 'events':
                return <Today/>;
            case 'events_week':
                return <Reorder/>;
            case 'home':
                return <Home/>;
            case 'lists':
                return <List/>;
            case 'login':
                return <ExitToApp/>;
            case 'navigateBefore':
                return <NavigateBefore/>;
            case 'navigateNext':
                return <NavigateNext/>;
            case 'ourService':
                return <Work/>;
            case 'price':
                return <AttachMoney/>;
            case 'prospect':
                return <Tune/>;
            case 'toggleOff':
                return <ToggleOff/>;
            case 'toggleOn':
                return <ToggleOn/>;
            case 'search':
                return <Search/>;
            case 'team':
                return <Group/>;
            default:
                return val;
        }
    },
    getIconCircle: (val) => {
        switch (val) {
            case 'activities':
                return <div className='icon__circle'><History/></div>;
            case 'events':
                return <div className='icon__circle'><Today/></div>;
            default:
                return val;
        }
    },
    getIconCircleWithOnClick: (val, func) => {
        switch (val) {
            case 'edit':
                return <div className='icon__circle__click' onClick={func}><Edit/></div>;
            case 'search':
                return <div className='icon__circle__click' onClick={func}><Search/></div>;
            default:
                return val;
        }
    },
};

import React from 'react';
import {
    Apartment,
    AttachMoney,
    Assignment,
    BarChart,
    DriveEta,
    Edit,
    ExitToApp,
    Extension,
    FreeBreakfast,
    Group,
    Help,
    History,
    Home,
    InsertDriveFile,
    List,
    Mail,
    NavigateBefore,
    NavigateNext,
    PhoneAndroid,
    Person,
    Reorder,
    Search,
    Settings,
    SettingsOverscan,
    Timeline,
    TrendingUp,
    Today,
    ToggleOff,
    ToggleOn,
    Tune,
    Work
} from '@material-ui/icons';


/**
 * Returns an icon: regular | with css class | with css class and onClick
 *
 * @param props.type
 * @param props.val
 */
export default (props) => {
    const onClick = (typeof props.onClick === 'function') ? props.onClick : null;
    let classname;
    if (onClick && props.type === 'circle') {
        classname = 'icon__circle__click';
    } else if (!onClick && props.type === 'circle') {
        classname = 'icon__circle';
    }

    switch (props.val) {
        case 'activities':
            return <History className={classname} onClick={onClick}/>;
        case 'activity':
            return <Timeline className={classname} onClick={onClick}/>;
        case 'agile':
            return <Assignment className={classname} onClick={onClick}/>;
        case 'analysis':
            return <TrendingUp className={classname} onClick={onClick}/>;
        case 'analyze':
            return <BarChart className={classname} onClick={onClick}/>;
        case 'call':
            return <PhoneAndroid className={classname} onClick={onClick}/>;
        case 'company':
            return <Apartment className={classname} onClick={onClick}/>;
        case 'did_call':
            return <PhoneAndroid className={classname} onClick={onClick}/>;
        case 'did_email':
            return <Mail className={classname} onClick={onClick}/>;
        case 'did_lose_price':
            return <AttachMoney className={classname} onClick={onClick}/>;
        case 'did_lose_product':
            return <Extension className={classname} onClick={onClick}/>;
        case 'did_lose_unknown':
            return <Help className={classname} onClick={onClick}/>;
        case 'did_lose_window':
            return <SettingsOverscan className={classname} onClick={onClick}/>;
        case 'did_mail':
            return <Mail className={classname} onClick={onClick}/>;
        case 'did_meeting':
            return <FreeBreakfast className={classname} onClick={onClick}/>;
        case 'did_post':
            return <Edit className={classname} onClick={onClick}/>;
        case 'edit':
            return <Edit className={classname} onClick={onClick}/>;
        case 'events':
            return <Today className={classname} onClick={onClick}/>;
        case 'eventsWeek':
            return <Reorder className={classname} onClick={onClick}/>;
        case 'home':
            return <Home className={classname} onClick={onClick}/>;
        case 'lists':
            return <List className={classname} onClick={onClick}/>;
        case 'login':
            return <ExitToApp className={classname} onClick={onClick}/>;
        case 'logout':
            return <ExitToApp className={classname} onClick={onClick}/>;
        case 'mail':
            return <Mail className={classname} onClick={onClick}/>;
        case 'meeting':
            return <FreeBreakfast className={classname} onClick={onClick}/>;
        case 'navigateBefore':
            return <NavigateBefore className={classname} onClick={onClick}/>;
        case 'navigateNext':
            return <NavigateNext className={classname} onClick={onClick}/>;
        case 'offer':
            return <InsertDriveFile className={classname} onClick={onClick}/>;
        case 'other':
            return <Help className={classname} onClick={onClick}/>;
        case 'ourService':
            return <Work className={classname} onClick={onClick}/>;
        case 'owner':
            return <Person className={classname} onClick={onClick}/>;
        case 'price':
            return <AttachMoney className={classname} onClick={onClick}/>;
        case 'prospect':
            return <Tune className={classname} onClick={onClick}/>;
        case 'search':
            return <Search className={classname} onClick={onClick}/>;
        case 'settings':
            return <Settings className={classname} onClick={onClick}/>;
        case 'team':
            return <Group className={classname} onClick={onClick}/>;
        case 'testride':
            return <DriveEta className={classname} onClick={onClick}/>;
        case 'toggleOff':
            return <ToggleOff className={classname} onClick={onClick}/>;
        case 'toggleOn':
            return <ToggleOn className={classname} onClick={onClick}/>;
        case 'user':
            return <Person className={classname} onClick={onClick}/>;
        case 'valuation':
            return <AttachMoney className={classname} onClick={onClick}/>;
        case 'visit':
            return <Group className={classname} onClick={onClick}/>;
        case 'will_call':
            return <PhoneAndroid className={classname} onClick={onClick}/>;
        case 'will_mail':
            return <Mail className={classname} onClick={onClick}/>;
        case 'will_meeting':
            return <FreeBreakfast className={classname} onClick={onClick}/>;
        case 'will_post':
            return <Edit className={classname} onClick={onClick}/>;
        default:
            return props.val;
    }
};

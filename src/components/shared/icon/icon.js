import React from 'react';
import {
    Apartment,
    AttachMoney,
    Assignment,
    BarChart,
    ChatBubble,
    ContactMail,
    Delete,
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
    SwapHoriz,
    Timeline,
    TrendingUp,
    Today,
    ToggleOff,
    ToggleOn,
    Tune,
    Work
} from '@material-ui/icons';


/**
 * Returns an icon: with or without onClick.

 * @param props.val
 */
export default (props) => {
    const onClick = (typeof props.onClick === 'function') ? props.onClick : null;

    switch (props.val) {
        case 'activities':
            return <History onClick={onClick}/>;
        case 'activity':
            return <Timeline onClick={onClick}/>;
        case 'agile':
            return <Assignment onClick={onClick}/>;
        case 'analysis':
            return <TrendingUp onClick={onClick}/>;
        case 'analyze':
            return <BarChart onClick={onClick}/>;
        case 'call':
            return <PhoneAndroid onClick={onClick}/>;
        case 'comment':
            return <ChatBubble onClick={onClick}/>;
        case 'company':
            return <Apartment onClick={onClick}/>;
        case 'did_call':
            return <PhoneAndroid onClick={onClick}/>;
        case 'did_email':
            return <Mail onClick={onClick}/>;
        case 'did_lose_price':
            return <AttachMoney onClick={onClick}/>;
        case 'did_lose_product':
            return <Extension onClick={onClick}/>;
        case 'did_lose_unknown':
            return <Help onClick={onClick}/>;
        case 'did_lose_window':
            return <SettingsOverscan onClick={onClick}/>;
        case 'did_mail':
            return <Mail onClick={onClick}/>;
        case 'did_meeting':
            return <FreeBreakfast onClick={onClick}/>;
        case 'did_post':
            return <ContactMail onClick={onClick}/>;
        case 'edit':
            return <Edit onClick={onClick}/>;
        case 'events':
            return <Today onClick={onClick}/>;
        case 'eventsWeek':
            return <Reorder onClick={onClick}/>;
        case 'home':
            return <Home onClick={onClick}/>;
        case 'lists':
            return <List onClick={onClick}/>;
        case 'login':
            return <ExitToApp onClick={onClick}/>;
        case 'logout':
            return <ExitToApp onClick={onClick}/>;
        case 'mail':
            return <Mail onClick={onClick}/>;
        case 'meeting':
            return <FreeBreakfast onClick={onClick}/>;
        case 'move':
            return <SwapHoriz onClick={onClick}/>;
        case 'navigateBefore':
            return <NavigateBefore onClick={onClick}/>;
        case 'navigateNext':
            return <NavigateNext onClick={onClick}/>;
        case 'offer':
            return <InsertDriveFile onClick={onClick}/>;
        case 'other':
            return <Help onClick={onClick}/>;
        case 'ourService':
            return <Work onClick={onClick}/>;
        case 'owner':
            return <Person onClick={onClick}/>;
        case 'price':
            return <AttachMoney onClick={onClick}/>;
        case 'prospect':
            return <Tune onClick={onClick}/>;
        case 'remove':
            return <Delete onClick={onClick}/>;
        case 'search':
            return <Search onClick={onClick}/>;
        case 'settings':
            return <Settings onClick={onClick}/>;
        case 'team':
            return <Group onClick={onClick}/>;
        case 'testride':
            return <DriveEta onClick={onClick}/>;
        case 'toggleOff':
            return <ToggleOff onClick={onClick}/>;
        case 'toggleOn':
            return <ToggleOn onClick={onClick}/>;
        case 'user':
            return <Person onClick={onClick}/>;
        case 'valuation':
            return <AttachMoney onClick={onClick}/>;
        case 'visit':
            return <Group onClick={onClick}/>;
        case 'will_call':
            return <PhoneAndroid onClick={onClick}/>;
        case 'will_mail':
            return <Mail onClick={onClick}/>;
        case 'will_meeting':
            return <FreeBreakfast onClick={onClick}/>;
        case 'will_post':
            return <ContactMail onClick={onClick}/>;
        default:
            return props.val;
    }
};

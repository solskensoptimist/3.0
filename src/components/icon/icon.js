import React from 'react';
import {
    Add,
    Apartment,
    AttachMoney,
    Assignment,
    BarChart,
    Check,
    CheckBoxOutlineBlank,
    Clear,
    Comment,
    ContactMail,
    Delete,
    Description,
    Done,
    DoubleArrow,
    DriveEta,
    Edit,
    ExitToApp,
    Extension,
    FreeBreakfast,
    FormatQuote,
    GetApp,
    Group,
    Help,
    Info,
    History,
    Home,
    InsertDriveFile,
    LibraryBooks,
    Link,
    LinkOff,
    List,
    Mail,
    Minimize,
    NavigateBefore,
    NavigateNext,
    PermContactCalendar,
    PhoneAndroid,
    Person,
    Refresh,
    Reorder,
    Replay,
    Save,
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
    VisibilityOff,
    Work,
    ZoomOutMap,
} from '@material-ui/icons';


/**
 * Returns an icon.
 * We use this to make sure we are consistent with our icon use.
 * Also easier to maintain when changing icon library etc.
 *
 * Can be rendered with onClick and with 'active' class.

 * @param props.active (optional) - bool
 * @param props.onClick (optional) - func
 * @param props.val - string
 */
export default (props) => {
    const onClick = (typeof props.onClick === 'function') ? props.onClick : null;

    switch (props.val) {
        case 'activities':
            return <History className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'activity':
            return <Timeline className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'add':
            return <Add className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'agile':
            return <Assignment className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'analysis':
            return <TrendingUp className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'analyze':
            return <BarChart className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'call':
            return <PhoneAndroid className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'car':
            return <DriveEta className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'checkbox':
            return <CheckBoxOutlineBlank className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'check':
            return <Check className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'clear':
            return <Clear className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'comment':
            return <Comment className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'company':
            return <Apartment className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'complete':
            return <Done className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'contact':
            return <PermContactCalendar className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'description':
            return <FormatQuote className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_call':
            return <PhoneAndroid className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_email':
            return <Mail className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_lose_price':
            return <AttachMoney className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_lose_product':
            return <Extension className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_lose_unknown':
            return <Help className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_lose_window':
            return <SettingsOverscan className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_mail':
            return <Mail className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_meeting':
            return <FreeBreakfast className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'did_post':
            return <ContactMail className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'download':
            return <GetApp className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'edit':
            return <Edit className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'events':
            return <Today className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'eventsCalendar':
            return <Today className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'eventsFlow':
            return <Reorder className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'file':
            return <InsertDriveFile className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'hide':
            return <VisibilityOff className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'home':
            return <Home className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'info':
            return <Info className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'link':
            return <Link className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'linkOff':
            return <LinkOff className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'list':
            return <List className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'lists':
            return <List className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'load':
            return <Refresh className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'login':
            return <ExitToApp className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'logout':
            return <ExitToApp className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'mail':
            return <Mail className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'maximize':
            return <ZoomOutMap className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'meeting':
            return <FreeBreakfast className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'minimize':
            return <Minimize className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'move':
            return <SwapHoriz className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'navigate':
            return <DoubleArrow className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'navigateBefore':
            return <NavigateBefore className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'navigateNext':
            return <NavigateNext className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'news':
            return <LibraryBooks className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'offer':
            return <Description className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'other':
            return <Help className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'ourService':
            return <Work className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'owner':
            return <Person className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'phone':
            return <PhoneAndroid className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'person':
            return <Person className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'price':
            return <AttachMoney className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'prospect':
            return <Tune className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'regret':
            return <Replay className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'remove':
            return <Delete className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'save':
            return <Save className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'search':
            return <Search className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'settings':
            return <Settings className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'team':
            return <Group className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'testride':
            return <DriveEta className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'toggleComments':
            return <Comment className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'toggleMoved':
            return <SwapHoriz className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'toggleOff':
            return <ToggleOff className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'toggleOn':
            return <ToggleOn className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'user':
            return <Person className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'valuation':
            return <AttachMoney className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'visit':
            return <Group className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'will_call':
            return <PhoneAndroid className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'will_mail':
            return <Mail className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'will_meeting':
            return <FreeBreakfast className={props.active ? 'active' : null} onClick={onClick}/>;
        case 'will_post':
            return <ContactMail className={props.active ? 'active' : null} onClick={onClick}/>;
        default:
            return props.val;
    }
};

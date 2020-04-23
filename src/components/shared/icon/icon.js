import React from 'react';
import {tc} from 'helpers';
import {
    Apartment,
    AttachMoney,
    Assignment,
    BarChart,
    Comment,
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
    LibraryBooks,
    List,
    Mail,
    Minimize,
    NavigateBefore,
    NavigateNext,
    PhoneAndroid,
    Person,
    Refresh,
    Reorder,
    Replay,
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
    Work,
    ZoomOutMap,
} from '@material-ui/icons';


/**
 * Returns an icon: with or without onClick.

 * @param props.val
 */
export default (props) => {
    const onClick = (typeof props.onClick === 'function') ? props.onClick : null;

    switch (props.val) {
        case 'activities':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <History onClick={onClick}/>
                    </div>
                );
            } else {
                return <History onClick={onClick}/>
            }
        case 'activity':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Timeline onClick={onClick}/>
                    </div>
                );
            } else {
                return <Timeline onClick={onClick}/>;
            }
        case 'agile':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Assignment onClick={onClick}/>
                    </div>
                );
            } else {
                return <Assignment onClick={onClick}/>;
            }
        case 'analysis':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <TrendingUp onClick={onClick}/>
                    </div>
                );
            } else {
                return <TrendingUp onClick={onClick}/>;
            }
        case 'analyze':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <BarChart onClick={onClick}/>
                    </div>
                );
            } else {
                return <BarChart onClick={onClick}/>;
            }
        case 'call':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <PhoneAndroid onClick={onClick}/>
                    </div>
                );
            } else {
                return <PhoneAndroid onClick={onClick}/>;
            }
        case 'comment':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Comment onClick={onClick}/>
                    </div>
                );
            } else {
                return <Comment onClick={onClick}/>;
            }
        case 'company':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Apartment onClick={onClick}/>
                    </div>
                );
            } else {
                return <Apartment onClick={onClick}/>;
            }
        case 'did_call':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <PhoneAndroid onClick={onClick}/>
                    </div>
                );
            } else {
                return <PhoneAndroid onClick={onClick}/>;
            }
        case 'did_email':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Mail onClick={onClick}/>
                    </div>
                );
            } else {
                return <Mail onClick={onClick}/>;
            }
        case 'load':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Refresh onClick={onClick}/>
                    </div>
                );
            } else {
                return <Refresh onClick={onClick}/>;
            }
        case 'did_lose_price':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <AttachMoney onClick={onClick}/>
                    </div>
                );
            } else {
                return <AttachMoney onClick={onClick}/>;
            }
        case 'did_lose_product':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Extension onClick={onClick}/>
                    </div>
                );
            } else {
                return <Extension onClick={onClick}/>;
            }
        case 'did_lose_unknown':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Help onClick={onClick}/>
                    </div>
                );
            } else {
                return <Help onClick={onClick}/>;
            }
        case 'did_lose_window':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <SettingsOverscan onClick={onClick}/>
                    </div>
                );
            } else {
                return <SettingsOverscan onClick={onClick}/>;
            }
        case 'did_mail':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Mail onClick={onClick}/>
                    </div>
                );
            } else {
                return <Mail onClick={onClick}/>;
            }
        case 'did_meeting':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <FreeBreakfast onClick={onClick}/>
                    </div>
                );
            } else {
                return <FreeBreakfast onClick={onClick}/>;
            }
        case 'did_post':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ContactMail onClick={onClick}/>
                    </div>
                );
            } else {
                return <ContactMail onClick={onClick}/>;
            }
        case 'edit':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Edit onClick={onClick}/>
                    </div>
                );
            } else {
                return <Edit onClick={onClick}/>;
            }
        case 'events':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Today onClick={onClick}/>
                    </div>
                );
            } else {
                return <Today onClick={onClick}/>;
            }
        case 'eventsCalendar':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Today onClick={onClick}/>
                    </div>
                );
            } else {
                return <Today onClick={onClick}/>;
            }
        case 'eventsFlow':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Reorder onClick={onClick}/>
                    </div>
                );
            } else {
                return <Reorder onClick={onClick}/>;
            }
        case 'home':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Home onClick={onClick}/>
                    </div>
                );
            } else {
                return <Home onClick={onClick}/>;
            }
        case 'lists':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <List onClick={onClick}/>
                    </div>
                );
            } else {
                return <List onClick={onClick}/>;
            }
        case 'login':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ExitToApp onClick={onClick}/>
                    </div>
                );
            } else {
                return <ExitToApp onClick={onClick}/>;
            }
        case 'logout':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ExitToApp onClick={onClick}/>
                    </div>
                );
            } else {
                return <ExitToApp onClick={onClick}/>;
            }
        case 'mail':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Mail onClick={onClick}/>
                    </div>
                );
            } else {
                return <Mail onClick={onClick}/>;
            }
        case 'maximize':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ZoomOutMap onClick={onClick}/>
                    </div>
                );
            } else {
                return <ZoomOutMap onClick={onClick}/>;
            }
        case 'meeting':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <FreeBreakfast onClick={onClick}/>
                    </div>
                );
            } else {
                return <FreeBreakfast onClick={onClick}/>;
            }
        case 'minimize':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Minimize onClick={onClick}/>
                    </div>
                );
            } else {
                return <Minimize onClick={onClick}/>;
            }
        case 'move':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <SwapHoriz onClick={onClick}/>
                    </div>
                );
            } else {
                return <SwapHoriz onClick={onClick}/>;
            }
        case 'navigateBefore':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <NavigateBefore onClick={onClick}/>
                    </div>
                );
            } else {
                return <NavigateBefore onClick={onClick}/>;
            }
        case 'navigateNext':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <NavigateNext onClick={onClick}/>
                    </div>
                );
            } else {
                return <NavigateNext onClick={onClick}/>;
            }
        case 'news':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <LibraryBooks onClick={onClick}/>
                    </div>
                );
            } else {
                return <LibraryBooks onClick={onClick}/>;
            }
        case 'offer':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <InsertDriveFile onClick={onClick}/>
                    </div>
                );
            } else {
                return <InsertDriveFile onClick={onClick}/>;
            }
        case 'other':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Help onClick={onClick}/>
                    </div>
                );
            } else {
                return <Help onClick={onClick}/>;
            }
        case 'ourService':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Work onClick={onClick}/>
                    </div>
                );
            } else {
                return <Work onClick={onClick}/>;
            }
        case 'owner':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Person onClick={onClick}/>
                    </div>
                );
            } else {
                return <Person onClick={onClick}/>;
            }
        case 'price':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <AttachMoney onClick={onClick}/>
                    </div>
                );
            } else {
                return <AttachMoney onClick={onClick}/>;
            }
        case 'prospect':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Tune onClick={onClick}/>
                    </div>
                );
            } else {
                return <Tune onClick={onClick}/>;
            }
        case 'regret':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Replay onClick={onClick}/>
                    </div>
                );
            } else {
                return <Replay onClick={onClick}/>;
            }
        case 'remove':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Delete onClick={onClick}/>
                    </div>
                );
            } else {
                return <Delete onClick={onClick}/>;
            }
        case 'search':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Search onClick={onClick}/>
                    </div>
                );
            } else {
                return <Search onClick={onClick}/>;
            }
        case 'settings':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Settings onClick={onClick}/>
                    </div>
                );
            } else {
                return <Settings onClick={onClick}/>;
            }
        case 'team':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Group onClick={onClick}/>
                    </div>
                );
            } else {
                return <Group onClick={onClick}/>;
            }
        case 'testride':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <DriveEta onClick={onClick}/>
                    </div>
                );
            } else {
                return <DriveEta onClick={onClick}/>;
            }
        case 'toggleComments':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Comment onClick={onClick}/>
                    </div>
                );
            } else {
                return <Comment onClick={onClick}/>;
            }
        case 'toggleMoved':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <SwapHoriz onClick={onClick}/>
                    </div>
                );
            } else {
                return <SwapHoriz onClick={onClick}/>;
            }
        case 'toggleOff':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ToggleOff onClick={onClick}/>
                    </div>
                );
            } else {
                return <ToggleOff onClick={onClick}/>;
            }
        case 'toggleOn':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ToggleOn onClick={onClick}/>
                    </div>
                );
            } else {
                return <ToggleOn onClick={onClick}/>;
            }
        case 'user':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Person onClick={onClick}/>
                    </div>
                );
            } else {
                return <Person onClick={onClick}/>;
            }
        case 'valuation':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <AttachMoney onClick={onClick}/>
                    </div>
                );
            } else {
               return <AttachMoney onClick={onClick}/>;
            }
        case 'visit':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Group onClick={onClick}/>
                    </div>
                );
            } else {
                return <Group onClick={onClick}/>;
            }
        case 'will_call':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <PhoneAndroid onClick={onClick}/>
                    </div>
                );
            } else {
                return <PhoneAndroid onClick={onClick}/>;
            }
        case 'will_mail':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <Mail onClick={onClick}/>
                    </div>
                );
            } else {
                return <Mail onClick={onClick}/>;
            }
        case 'will_meeting':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <FreeBreakfast onClick={onClick}/>
                    </div>
                );
            } else {
                return <FreeBreakfast onClick={onClick}/>;
            }
        case 'will_post':
            if (props.hover) {
                return (
                    <div className='iconWrapper'>
                        <div className='iconWrapper__hoverBox'>{tc[props.val]}</div>
                        <ContactMail onClick={onClick}/>
                    </div>
                );
            } else {
                return <ContactMail onClick={onClick}/>;
            }
        default:
            return props.val;
    }
};

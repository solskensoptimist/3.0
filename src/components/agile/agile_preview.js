import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {dealHelper, tc} from 'helpers';
import moment from 'moment';
import {completeEvent, removeEvent} from 'store/events/tasks';
import history from '../../router_history';
import companyHelper from 'shared_helpers/company_helper';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from '../tooltip/tooltip';

const AgilePreview = (state) => {
    const [item, setItem] = useState(null);
    const [hideBlocks, setHideBlocks] = useState([]);
    const [type, setType] = useState('');

    useEffect(() => {
        if (state.props.id && state.agile.columns && Array.isArray(state.agile.columns)) {
            let found;
            state.agile.columns.forEach((column) => {
                if (column.id === 'prospects' && column.items.find((num) => num.prospectId === state.props.id)) {
                     found = column.items.find((num) => num.prospectId === state.props.id);
                } else if (column.items.find((num) => num._id === state.props.id)) {
                    found = column.items.find((num) => num._id === state.props.id);
                }
            });

            if (found) {
                setItem(found);
                setType((found._id ? 'deal' : 'prospect'))
            }
        }
    }, [state.agile.columns, state.props.id]);

    const _renderColleagueDealRows = () => {
        return (
            <>
                {item.colleagueDeals.map((num, i) => {
                    return (
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row' key={i}>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left'>
                                <span className='highlight extraMarginRight'><Icon val='infoOutlined'/></span>
                                {`${tc.appearsWith} ${tc.colleague.toLowerCase()}`}
                                <span className='highlight marginLeft marginRight'>{num.name}</span>
                                {`${tc.with.toLowerCase()} ${tc.phase.toLowerCase()}`}
                                <span className='highlight marginLeft'>{dealHelper.getReadablePhase(num.phase)}</span>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    const _renderDealInfoBlock = () => {
        if (type === 'deal') {
            /*
            ANVÄND /getPreview eller vad det nu är vi har...?!?!?
            Eller bygg en ny route för detta.
            Ha en preview reducer...?
            Kan ju börja visa notifikationer ändå.
            Använd useEffect, och sätt en flagga: previewDataIsCollected.
            Rendera det block som går utan att vänta på denna flagga.
             */

            return (
                <div className='agilePreviewWrapper__agilePreview__content__block'>
                    <div className='agilePreviewWrapper__agilePreview__content__block__title'
                        onClick={() => {
                            if (hideBlocks.includes('dealInfo')) {
                                setHideBlocks(hideBlocks.filter((num) => num !== 'dealInfo'));
                            } else {
                                setHideBlocks(hideBlocks.concat('dealInfo'));
                            }
                        }}
                    >
                        {(hideBlocks.includes('dealInfo')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                        {tc.deal}
                    </div>
                    {(!hideBlocks.includes('dealInfo')) ?
                        <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder'>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox'>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                            {tc.owner}:
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                            {item.userName}
                                        </div>
                                    </div>
                                    {(item.description && item.description.length) ?
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                                {tc.description}:
                                            </div>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                                {item.description}
                                            </div>
                                        </div> : null
                                    }
                                    {(item.potential && item.potential.length) ?
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                                {tc.potential}:
                                            </div>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                                {item.potential}
                                            </div>
                                        </div> : null
                                    }
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                            {tc.belongsToList}:
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                            Hämta listnamn här...
                                        </div>
                                    </div>
                                    {(item.maturity && item.maturity.length) ?
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                                {tc.maturity}:
                                            </div>
                                            <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                                {dealHelper.getMaturityName(item.maturity)}
                                            </div>
                                        </div> : null
                                    }
                                </div>
                                <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox'>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                            {tc.phase}:
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                            {dealHelper.getReadablePhase(item.phase)}
                                        </div>
                                    </div>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                            {tc.created}:
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                            {moment(new Date(item.created)).format('LL HH:mm')}
                                        </div>
                                    </div>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row'>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__left'>
                                            {tc.lastUpdate}:
                                        </div>
                                        <div className='agilePreviewWrapper__agilePreview__content__block__content__infoBoxHolder__infoBox__row__right'>
                                            {moment(new Date(item.updated)).format('LL HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }
                </div>
            );
        } else {
            return null;
        }
    };

    const _renderEventRows = () => {
        return (
            <>
            {item.events.map((event) => {
                const diff = moment(event.event_date).diff(new Date(), 'hours');
                let extraClass = false;

                if (diff < (7 * 24) && diff > 24) {
                    extraClass = 'withinOneWeek';
                } else if (diff < 24 && diff >= 0) {
                    extraClass = 'withinOneDay';
                } else if (diff < 0) {
                    extraClass = 'passedDate'
                }

                return (
                    <React.Fragment key={event._id}>
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row'>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left'>
                                <span className={'extraMarginRight ' + extraClass}><Icon val={event.action}/></span>
                                <span className='highlight marginRight'>{tc[event.action]}</span>
                                {`${moment(new Date(event.event_date)).format(' dddd D MMM HH:mm')}`}
                                {(event.comment) ?
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left__additionalLine'>
                                        <span className='lightAndItalic'>{event.comment}</span>
                                    </div> : null
                                }
                            </div>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__right'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.completeEvent}>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__row__right__icon'
                                         onClick={async () => {
                                             await completeEvent({eventId: event._id});
                                         }}
                                    >
                                        <Icon val='check'/>
                                    </div>
                                </Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.removeEvent}>
                                    <div className='agilePreviewWrapper__agilePreview__content__block__content__row__right__icon'
                                         onClick={async () => {
                                             await removeEvent({dealId: item._id, eventId: event._id});
                                         }}
                                    >
                                        <Icon val='remove'/>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
            </>
        );
    };

    const _renderNotificationsBlock = () => {
        if ((item.events && item.events.length) || item.colleagueDeals || item.ownActiveDeals) {
            return (
                <div className='agilePreviewWrapper__agilePreview__content__block'>
                    <div className='agilePreviewWrapper__agilePreview__content__block__title'
                         onClick={() => {
                             if (hideBlocks.includes('notifications')) {
                                 setHideBlocks(hideBlocks.filter((num) => num !== 'notifications'));
                             } else {
                                 setHideBlocks(hideBlocks.concat('notifications'));
                             }
                         }}
                    >
                        {(hideBlocks.includes('notifications')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                        {tc.notifications}
                    </div>
                    {(!hideBlocks.includes('notifications')) ?
                        <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                            {(type === 'deal' && item.events && item.events.length) ? _renderEventRows() : null}
                            {(item.colleagueDeals && Array.isArray(item.colleagueDeals)) ? _renderColleagueDealRows() : null}
                            {(item.ownActiveDeals && Array.isArray(item.ownActiveDeals)) ? _renderOwnActiveDealRows() : null}
                        </div> : null
                    }
                </div>
            );
        } else {
            return null;
        }
    };

    const _renderOwnActiveDealRows = () => {
        return (
            <>
                {item.ownActiveDeals.map((num, i) => {
                    return (
                        <div className='agilePreviewWrapper__agilePreview__content__block__content__row' key={i}>
                            <div className='agilePreviewWrapper__agilePreview__content__block__content__row__left'>
                                <span className='extraMarginRight'><Icon val='list'/></span>
                                {`${tc.appearsIn} ${tc.list.toLowerCase()}`}
                                <span className='highlight marginLeft marginRight'>{num.listName}</span>
                                {`${tc.with.toLowerCase()} ${tc.phase.toLowerCase()}`}
                                <span className='highlight marginLeft'>{dealHelper.getReadablePhase(num.phase)}</span>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    const _renderProspectInfoBlock = () => {
        // Om prospekt, rendera bara prospektet.
        // Om deal, rendera det som vi hämtar till dealProspectInfo, eller vad får vi i /getPreview...?
        return (
            <div className='agilePreviewWrapper__agilePreview__content__block'>
                <div className='agilePreviewWrapper__agilePreview__content__block__title'
                     onClick={() => {
                         if (hideBlocks.includes('prospectInfo')) {
                             setHideBlocks(hideBlocks.filter((num) => num !== 'prospectInfo'));
                         } else {
                             setHideBlocks(hideBlocks.concat('prospectInfo'));
                         }
                     }}
                >
                    {(hideBlocks.includes('prospectInfo')) ? <Icon val='maximize'/> : <Icon val='minimize'/>}
                    {tc.prospectInfo}
                </div>
                {(!hideBlocks.includes('prospectInfo')) ?
                    <div className='agilePreviewWrapper__agilePreview__content__block__content'>
                        Prospektinformation
                    </div> : null
                }
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(item && type.length);
    };

    /*
    Vagnpark
    Kommentarsmöjlighet
    Aktivitet / Aktivitet med endast kommentarer?
     */

    return ( _stateCheck() ?
            <div className='agilePreviewWrapper'>
                <div className='agilePreviewWrapper__agilePreview'>
                    <div className='agilePreviewWrapper__agilePreview__header'>
                        <div className='agilePreviewWrapper__agilePreview__header__main'
                            onClick={() => {
                                if (type === 'deal') {
                                    history.push('/affar/' + state.props.id);
                                } else if (companyHelper.isValidOrgNr(state.props.id)) {
                                    history.push('/foretag/' + state.props.id);
                                } else {
                                    history.push('/person/' + state.props.id);
                                }
                            }}
                         >
                            {item.name}
                            <div className='agilePreviewWrapper__agilePreview__header__main__navigate'>
                                <Icon val='navigate'/>
                            </div>
                        </div>
                        <div className='agilePreviewWrapper__agilePreview__header__sub'>
                            <div className='agilePreviewWrapper__agilePreview__header__sub__sub'>
                                <Icon val='agile'/>
                            </div>
                        </div>
                    </div>
                    <div className='agilePreviewWrapper__agilePreview__content'>
                        {_renderNotificationsBlock()}
                        {_renderDealInfoBlock()}
                        {_renderProspectInfoBlock()}
                    </div>
                </div>
            </div> :
            <Loading/>
    );
};


const MapStateToProps = (state, props) => {
    return {
        agile: state.agile,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(AgilePreview);

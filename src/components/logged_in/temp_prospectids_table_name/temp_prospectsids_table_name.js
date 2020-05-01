import React, {useState} from 'react';
import {connect} from 'react-redux';
import {tc} from "helpers";
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * This component takes a list of prospect ids (TS user ids) and renders a list of basic info, like name, city etc.
 */
const TempProspectsidsTableName = (state) => {
    /*
    När jag byter namn på denna komponent, byt namn på css-klasser också.
     */

    /*
    I deal store kommer jag sätta prospectInfo, och en lista med dessa.
     */
    const [minimize, setMinimize] = useState(false);

    const _stateCheck = () => {
        return !!(state && state.deal && state.prospectInfo);
    };

    return ( _stateCheck() ?
        <div className='prospectsWrapper'>
            <div className='prospectsWrapper__prospects'>
                <div className='prospectsWrapper__prospects__header'>
                    <WidgetHeader
                        iconVal='list'
                        dashboard={
                            <>
                                {minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            </>
                        }
                        headline='Tilfälligt namn'
                        headlineSub='Tilfälligt subnamn'
                    />
                </div>
                <div className={minimize ? 'hide' : 'prospectsWrapper__prospects__content'}>
                    <p>Prospekt-lista.</p>
                    <p>Id-lista: {state.deal.prospectInfo[0]}</p>
                </div>
            </div>
        </div> :
        <Loading/>
    );
};


const MapStateToProps = (state, props) => {
    return {
        deal: state.deal,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(TempProspectsidsTableName);

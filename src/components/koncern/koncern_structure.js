import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import Loading from 'components/loading';
import Table from 'components/table';
import WidgetHeader from 'components/widget_header';
import Tooltip from "../tooltip/tooltip";
import Icon from "../icon/icon";

const KoncernStructure = (state) => {
    const [minimize, setMinimize] = useState(false);
    const [total, setTotal] = useState(null);
    const [structure, setStructure] = useState(null);

    const _onSelect = (arr) => {
        // Denna är inte klar... kan man ha raderna som selected per default?
        // Får jag skriva något eget för det..?

        if (arr.length) {
            // Filter on selected
            let numberOfCars = 0;
            state.company.koncern.structure.forEach((num) => {
                if (!arr.includes(num.id)) {
                    numberOfCars = numberOfCars + num.numberOfCars;
                }
            });
            setTotal(numberOfCars);
        } else {
            setTotal(state.company.koncern.cars);
        }
    };

    const _stateCheck = () => {
        return !!(state && state.company && state.company.koncern && state.company.koncern.structure);
    };

    useEffect(() => {
        if (state.company.koncern && state.company.koncern.cars) {
            setTotal(state.company.koncern.cars);
        }
        if (state.company.koncern && state.company.koncern.structure) {
            setStructure(state.company.koncern.structure);
        }
    }, [state.company.koncern]);

    return (_stateCheck() ?
        <div className='companyStructureWrapper'>
            <div className='companyStructureWrapper__companyStructure'>
                <div className='companyStructureWrapper__companyStructure__header'>
                    <WidgetHeader
                        iconVal='koncern'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={tc.koncernStructure}
                        headlineSub={'Antal koncernbolag: 16. Antal fordon: 18.'}
                    />
                </div>
                {!minimize &&
                    <div className='companyStructureWrapper__companyStructure__content'>
                        <Table
                            columns={tableHelper.getKoncernStructureColumns()}
                            onSelect={_onSelect} rows={tableHelper.getKoncernStructureRows(structure, total)}
                            rowsPerPage={50}
                        />
                    </div>
                }
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        company: state.company,
    };
};

export default connect(
    MapStateToProps,
)(KoncernStructure);

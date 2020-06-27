import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import Loading from 'components/loading';
import Table from 'components/table';
import WidgetHeader from 'components/widget_header';
import Tooltip from "../tooltip/tooltip";
import Icon from "../icon/icon";

/**
 * Render a table for koncern structure, I.E. vehicle data for all companies within a koncern.
 */
const KoncernStructure = (state) => {
    const [disabledRows, setDisabledRows] = useState([]);
    const [minimize, setMinimize] = useState(false);
    const [total, setTotal] = useState(null);
    const [structure, setStructure] = useState(null);

    /**
     * Update which rows are selected - this affect state.total (amount to calculate percentages of),
     * and state.disabledRows (which rows to disable).
     */
    const _onSelect = (arr) => {
        if (arr.length) {
            let numberOfCars = 0;
            let disabled = [];

            structure.forEach((num) => {
                if (arr.includes(num.id)) {
                    numberOfCars = numberOfCars + num.numberOfCars;
                } else {
                    disabled.push(num.id);
                }
            });

            setTotal(numberOfCars);
            setDisabledRows(disabled);
        } else {
            setTotal(0);
            setDisabledRows(structure.map((num) => num.id));
        }
    };

    const _stateCheck = () => {
        return !!structure;
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
                        headlineSub={`${tc.amountKoncernCompanies}: ${state.company.koncern.count}. ${tc.amountVehicles}: ${state.company.koncern.cars}.`}
                    />
                </div>
                {!minimize &&
                    <div className='companyStructureWrapper__companyStructure__content'>
                        <Table
                            columns={tableHelper.getKoncernStructureColumns()}
                            onSelect={_onSelect}
                            rows={tableHelper.getKoncernStructureRows(structure, total, disabledRows)}
                            preSelectedRows={structure.map((num) => num.id)}
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

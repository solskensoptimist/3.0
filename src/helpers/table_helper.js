import React from 'react';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import {tc} from 'helpers';
import {vehicleHelper} from 'helpers';
import moment from 'moment';

/**
 * These methods help us format data for use in Table component.
 *
 * Keep id for columns consistent with what is sent from backend, since that is what we send back to sort on columns.
 */
export const tableHelper = {
    getFleetColumns: (historic) => {
        if (historic) {
            return [
                {id: 'brand', numeric: false, label: tc.brand},
                {id: 'model', numeric: false, label: tc.model},
                {id: 'type', numeric: false, label: tc.type},
                {id: 'reg_number', numeric: false, label: tc.regNumberShort},
                {id: 'new', numeric: false, label: tc.bought},
                {id: 'real_date_sold', numeric: false, label: tc.sold},
                {id: 'holdingPeriod', numeric: false, label: tc.holdingPeriod},
                {id: 'acquiredAges', numeric: false, label: tc.acquiredAges},
                {id: 'seller_name', numeric: false, label: tc.sellerName},
            ];
        } else {
            return [
                {id: 'brand', numeric: false, label: tc.brand},
                {id: 'model', numeric: false, label: tc.model},
                {id: 'type', numeric: false, label: tc.type},
                {id: 'reg_number', numeric: false, label: tc.regNumberShort},
                {id: 'new', numeric: false, label: tc.bought},
                {id: 'possession', numeric: false, label: tc.acquiredAges},
                {id: 'date_registered', numeric: false, label: tc.regYear},
                {id: 'financed_by', numeric: false, label: tc.financed},
                {id: 'seller_name', numeric: false, label: tc.sellerName},
            ];
        }
    },
    getFleetRows: (rows, historic) => {
        if (rows && rows.length) {
            return historic ? getFleetRowsHistoric(rows) : getFleetRowsCurrent(rows);
        } else {
            return [];
        }
    },
    getKoncernStructureColumns: () => {
        return [
            {id: 'name', numeric: false, label: tc.name},
            {id: 'numberOfCars', numeric: true, label: tc.total},
            {id: 'numberOfCarsATV', numeric: true, label: tc.ATV},
            {id: 'numberOfCarsBU', numeric: true, label: tc.BU},
            {id: 'numberOfCarsHB', numeric: true, label: tc.HB},
            {id: 'numberOfCarsHV', numeric: true, label: tc.HV},
            {id: 'numberOfCarsLB', numeric: true, label: tc.LB},
            {id: 'numberOfCarsMC', numeric: true, label: tc.MC},
            {id: 'numberOfCarsPB', numeric: true, label: tc.PB},
            {id: 'numberOfCarsSS', numeric: true, label: tc.SS},
            {id: 'numberOfCarsSV', numeric: true, label: tc.SV},
            {id: 'numberOfCarsTLB', numeric: true, label: tc.TLB},
        ];
    },
    getKoncernStructureRows: (structure, total, disabledRows) => {
        if (!structure || structure.length === 0) {
            return [];
        }

        const columns = tableHelper.getKoncernStructureColumns();
        return structure.map((row, i) => {
            const obj = {};
            columns.forEach((column) => {
                if (column.id === 'numberOfCars') {
                    if (disabledRows.includes(row.id)) {
                        // Row is disabled, don't show any value.
                        obj[column.id] = '';
                    } else {
                        if (row[column.id] === 0) {
                            // Value is 0, don't add percentage.
                            obj[column.id] = row[column.id];
                        } else {
                            // Add percentage.
                            const share = Math.round(row[column.id] / total * 100);
                            obj[column.id] = `${row[column.id]} (${share}%)`;
                        }
                    }
                } else if (column.id === 'name') {
                    // Add divs with classes based on row level aswell as level of next row.
                    const nextRow = structure[i + 1];
                    let space;
                    switch (row.level) {
                        case 1:
                            space = <div className={(nextRow && nextRow.level === row.level) ?
                                'koncernStructureItem__koncernStructureSameLevel1' :
                                'koncernStructureItem__koncernStructureLevel1'
                            }/>;
                            break;
                        case 2:
                            space = <div className={(nextRow && nextRow.level === row.level) ?
                                'koncernStructureItem__koncernStructureSameLevel2' :
                                'koncernStructureItem__koncernStructureLevel2'
                            }/>;
                            break;
                        case 3:
                            space = <div className={(nextRow && nextRow.level === row.level) ?
                                'koncernStructureItem__koncernStructureSameLevel3' :
                                'koncernStructureItem__koncernStructureLevel3'
                            }/>;
                            break;
                        case 4:
                            space = <div className={(nextRow && nextRow.level === row.level) ?
                                'koncernStructureItem__koncernStructureSameLevel4' :
                                'koncernStructureItem__koncernStructureLevel4'
                            }/>;
                            break;
                        case 5:
                            space = <div className={(nextRow && nextRow.level === row.level) ?
                                'koncernStructureItem__koncernStructureSameLevel5' :
                                'koncernStructureItem__koncernStructureLevel5'
                            }/>;
                            break;
                        case 6:
                            space = <div className={(nextRow && nextRow.level === row.level) ?
                                'koncernStructureItem__koncernStructureSameLevel6' :
                                'koncernStructureItem__koncernStructureLevel6'
                            }/>;
                            break;
                        default:
                            space = '';
                    }
                    obj[column.id] = <div className='koncernStructureItem'>{space}{row[column.id]}</div>
                } else {
                    obj[column.id] = (!row[column.id] && row[column.id] !== 0) ? tc.dataMissing : row[column.id];
                }
            });

            obj.id = row.id;
            obj.url = '/foretag/' + row.id;

            return obj;
        });
    },
    getLeadsWidgetColumns: () => {
        return [
            {id: 'name', numeric: false, label: tc.name},
            {id: 'leadsType', numeric: false, label: tc.leadsType},
            {id: 'received', numeric: false, label: tc.received},
        ];
    },
    getLeadsWidgetRows: (rows) => {
        const columns = tableHelper.getLeadsWidgetColumns();
        return rows.map((row) => {
            const obj = {};
            columns.forEach((column) => {
                if (column.id === 'received') {
                    let date = row._id.toString().substring(0,8);
                    date = new Date( parseInt( date, 16 ) * 1000);
                    obj[column.id] = moment(date).fromNow();
                } else if (column.id === 'name') {
                    obj[column.id] = row.fullName;
                } else {
                    obj[column.id] = row[column.id];
                }
            });

            return obj;
        });
    },
    getListsColumns: () => {
        return [
            {id: 'name', numeric: false, label: tc.name},
            {id: 'total', numeric: true, label: tc.amount},
            {id: 'created', numeric: false, label: tc.created},
            {id: 'complement', numeric: false, label: tc.complement},
            {id: 'creatorName', numeric: false, label: tc.createdBy},
            {id: 'dealerName', numeric: false, label: tc.company},
        ];
    },
    getListsRows: (rows) => {
        const columns = tableHelper.getListsColumns();
        return rows.map((row, i) => {
            const verticalDirection = (i > 2) ? 'top' : 'bottom';
            const obj = {};
            columns.forEach((column) => {
                if (column.id === 'created') {
                    obj[column.id] = moment(new Date(row[column.id])).format('YYYY-MM-DD');
                } else if (column.id === 'complement') {
                    obj[column.id] =
                        <div className='tableCellIconHolder'>
                            {
                                (row.orderHistory && row.orderHistory.name && row.orderHistory.name.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.waitingForNameOrder} verticalDirection={verticalDirection}><Icon val='person'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.name && row.orderHistory.name.isAvailable && !row.orderHistory.name.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.orderedName} verticalDirection={verticalDirection}><Icon active={true} val='person'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.name && !row.orderHistory.name.isAvailable && !row.orderHistory.name.isPending && row.orderHistory.name.isDelivered) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.haveOldNameOrder} verticalDirection={verticalDirection}><Icon val='person'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.phone && row.orderHistory.phone.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.waitingForPhoneOrder} verticalDirection={verticalDirection}><Icon val='phone'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.phone && row.orderHistory.phone.isAvailable && !row.orderHistory.phone.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.orderedPhone} verticalDirection={verticalDirection}><Icon active={true} val='phone'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.phone && !row.orderHistory.phone.isAvailable && !row.orderHistory.phone.isPending && row.orderHistory.phone.isDelivered) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.haveOldPhoneOrder} verticalDirection={verticalDirection}><Icon val='phone'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.mailings && row.orderHistory.mailings.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.waitingForMailingsOrder} verticalDirection={verticalDirection}><Icon val='mail'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.mailings && !row.orderHistory.mailings.isPending && row.orderHistory.mailings.isDelivered) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.orderedMailings} verticalDirection={verticalDirection}><Icon active={true} val='mail'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.company && row.orderHistory.company.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.waitingForCompanyOrder} verticalDirection={verticalDirection}><Icon val='company'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.company && row.orderHistory.company.isAvailable && !row.orderHistory.company.isPending) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.orderedCompany} verticalDirection={verticalDirection}><Icon active={true} val='company'/></Tooltip>
                            }
                            {
                                (row.orderHistory && row.orderHistory.company && !row.orderHistory.company.isAvailable && !row.orderHistory.company.isPending && row.orderHistory.company.isDelivered) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.haveOldCompanyOrder} verticalDirection={verticalDirection}><Icon val='company'/></Tooltip>
                            }
                            {
                                (row.meta && row.meta.subscription_ids && row.meta.subscription_ids.length) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.subscription} verticalDirection={verticalDirection}><Icon active={true} val='subscription'/></Tooltip>
                            }
                            {
                                (row.meta && (!row.meta.subscription_ids || (row.meta.subscription_ids && !row.meta.subscription_ids.length)) && row.meta.criterias && Object.keys(row.meta.criterias).length) &&
                                <Tooltip horizontalDirection='right' tooltipContent={tc.subscriptionPossible} verticalDirection={verticalDirection}><Icon val='subscription'/></Tooltip>
                            }
                        </div>
                } else {
                    obj[column.id] = row[column.id];
                }

                obj.id = row._id;
            });

            return obj;
        });
    },
    getSupertempWidgetColumns: () => {
        return [
            {id: 'name', numeric: false, label: tc.vehicleUser},
            {id: 'brand', numeric: false, label: tc.brand},
            {id: 'submitted', numeric: false, label: tc.submitted},
        ];
    },
    getSupertempWidgetRows: (rows) => {
        const columns = tableHelper.getSupertempWidgetColumns();
        return rows.map((row) => {
            const obj = {};
            columns.forEach((column) => {
                if (column.id === 'submitted') {
                    obj[column.id] = moment(new Date(row.supertemp.added)).fromNow();
                } else if (column.id === 'name') {
                    obj[column.id] = row.name.fullName;
                } else {
                    obj[column.id] = row[column.id];
                }

                obj.url = `/bil/${row.reg_number}`
            });

            return obj;
        });
    },
};

const getFleetRowsCurrent = (rows) => {
    const columns = tableHelper.getFleetColumns();
    return rows.map((row) => {
        const obj = {};
        columns.forEach((column) => {
            if (column.id === 'date_registered') {
                obj[column.id] = new Date(row[column.id]).getFullYear();
            } else if (column.id === 'new') {
                obj[column.id] = (!(row[column.id] & 2)) ? tc.used : tc.new;
            } else if (column.id === 'possession') {
                obj[column.id] = `${row[column.id]} ${tc.months.toLowerCase()}`;
            } else if (column.id === 'type') {
                obj[column.id] = vehicleHelper.getVehicleTypeFromAbbr(row[column.id]);
            } else {
                obj[column.id] = row[column.id];
            }
        });

        obj.url = '/bil/' + row.reg_number;

        return obj;
    });
};

const getFleetRowsHistoric = (rows) => {
    const columns = tableHelper.getFleetColumns(true);
    return rows.map((row) => {
        const obj = {};
        columns.forEach((column) => {
            if (column.id === 'holdingPeriod') {
                obj[column.id] = row.date_acquired + ' - ' + row.date_sold;
            } else if (column.id === 'acquiredAges') {
                obj[column.id] = (row[column.id] && row[column.id].months) ? row[column.id].months + ' ' + tc.months.toLowerCase() : null;
            } else if (column.id === 'new') {
                obj[column.id] = (!(row[column.id] & 2)) ? tc.used : tc.new;
            } else if (column.id === 'type') {
                obj[column.id] = vehicleHelper.getVehicleTypeFromAbbr(row[column.id]);
            }  else {
                obj[column.id] = row[column.id];
            }
        });

        obj.url = '/bil/' + row.reg_number;

        return obj;
    });
};

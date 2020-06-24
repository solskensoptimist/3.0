import React from 'react';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import {tc} from 'helpers';
import {vehicleHelper} from 'helpers';
import moment from 'moment';

/**
 * These methods help us format data to use in Table component.
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
            {id: 'ordered', numeric: false, label: tc.ordered},
            {id: 'creatorName', numeric: false, label: tc.createdBy},
            {id: 'dealerName', numeric: false, label: tc.company},
        ];
    },
    getListsRows: (rows) => {
        const columns = tableHelper.getListsColumns();
        return rows.map((row) => {
            const obj = {};
            columns.forEach((column) => {
                if (column.id === 'created') {
                    obj[column.id] = moment(new Date(row[column.id])).format('YYYY-MM-DD');
                } else if (column.id === 'ordered') {
                    obj[column.id] =
                        <div className='tableCellIconHolder'>
                            {row.order && <Tooltip horizontalDirection='right' tooltipContent={tc.orderedName}><Icon val='person'/></Tooltip>}
                            {row.phoneOrder && <Tooltip horizontalDirection='right' tooltipContent={tc.orderedPhone}><Icon val='phone'/></Tooltip>}
                            {row.orderMailings && <Tooltip horizontalDirection='right' tooltipContent={tc.orderedMailings}><Icon val='mail'/></Tooltip>}
                            {row.orderCompany && <Tooltip horizontalDirection='right' tooltipContent={tc.orderedCompany}><Icon val='company'/></Tooltip>}
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

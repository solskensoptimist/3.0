import React, {useState} from 'react';
import history from '../../router_history';
import Tooltip from 'components/tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {tc} from "helpers";

/**
 * Table component.
 *
 * Rows can be selectable (but not when rows are linked).
 * Rows can be navigation links (but not when rows are selectable).
 * Cells can be editable.
 * Cells can have a hover effect, if so that property should be an object with a 'content' and a 'hover' property.
 *
 * Two examples on how to use this component, first with rows that are links, second with selectable rows:
 *      <Table columns={tableHelper.getFleetColumns(state.props.historic)} linkRows={true} rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}/>
 *      <Table columns={tableHelper.getFleetColumns(state.props.historic)} onSelect={_onSelect} rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}/>
 *
 * @param props.linkRows - bool (optional) - Set to true when we want every row to be a navigational link. If so, every row object must have a 'url' property with a route value.
 * @param props.onSelect - func (optional) - Provide this function when rows are to be selectable, this function receives the selected ids array. If so, every row object must have an 'id' property with a unique value.
 * @param props.columns - array
 *      Example 1 (used with example 1 for rows): [
 *          { id: 'name', numeric: false, label: 'Dessert (100g serving)' },
 *          { id: 'calories', numeric: true, label: 'Calories' },
 *          { id: 'fat', numeric: true, label: 'Fat (g)' },
 *      ];
 *      Example 2 (used with example 2 for rows): [
 *          { id: 'brand', numeric: false, label: 'Märke' },
 *          { id: 'reg_number', numeric: false, label: 'Registreringsnummer' },
 *      ];
 *      Example 3 (used with example 3 for rows): [
 *          { id: 'name', numeric: false, label: 'Namn' },
 *          { id: 'zipMuncipality', numeric: false, label: 'Ort' },
 *          { id: 'activity', numeric: false, label: 'Aktivitet' },
 *      ];
 *  @param props.rows - array
 *      Example 1 (rows are selectable): [
 *          {id: '123abc', name: 'Sockerkaka', calories: 100, fat: 50},
 *          {id: '456qwe', name: 'Chokladboll', calories: 200, fat: 100},
 *          {id: '789bnm', name: 'Havrekaka', calories: 100, fat: 50},
 *      ];
 *      Example 2 (rows are links): [
 *          {reg_number: 'abc123', brand: 'HONDA', url: '/bil/abc123'},
 *          {reg_number: 'rty456', brand: 'VOLOV', url: '/bil/rty456'},
 *      ];
 *      Example 3 (rows are links, and activity-property have hover effect.): [
 *          {name: 'Kvinna 28', zipMuncipality: 'Motala', url: '/person/4567812', activity: {content: <Icon val='list'>, hover: <div>Detta prospekt finns i 2 listor</div>}},
 *          {name: 'Man 54', zipMuncipality: 'helsingborg', url: '/person/6956896', activity: {content: <Icon val='list'>, hover: <div>Detta prospekt finns i 4 listor</div>}},
 *      ];
 *   Note that every object must have an 'id' property with a unique value when props.onSelect is a function.
 *   Note that every object must have a 'url' property with a route value when props.linkRows === true.
 */
export default (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        if (props.onSelect && typeof props.onSelect === 'function') {
            props.onSelect(newSelected);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = props.rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const renderCellsForRow = (row) => {
        const rows = [];
        let index = 0;
        for (const prop in row) {
            if (prop !== 'id' && prop !== 'url') {
                index++;
                const column = props.columns.find((column) => column.id === prop);
                if (typeof row[prop] === 'object' && row[prop] !== null && row[prop].content && row[prop].hover) {
                    // Add hover hover effect to this cell.
                    rows.push(
                        <TableCell align={column.numeric ? 'right' : 'left'} key={`${row[prop]}${index}`}>
                            <Tooltip horizontalDirection='right' tooltipContent={row[prop].hover}>
                                {row[prop].content}
                            </Tooltip>
                        </TableCell>
                    );
                } else {
                    rows.push(<TableCell align={column.numeric ? 'right' : 'left'} key={`${row[prop]}${index}`}>{row[prop]}</TableCell>);
                }
            }
        }

        return rows;
    };

    const renderTableHead = () => {
        const createSortHandler = (property) => (event) => {
            handleRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {(props.onSelect && typeof props.onSelect === 'function') &&
                        <TableCell>
                            <Checkbox
                                indeterminate={selected.length > 0 && selected.length < props.rows.length}
                                checked={props.rows.length > 0 && selected.length === props.rows.length}
                                onChange={handleSelectAllClick}
                                inputProps={{ 'aria-label': 'select all' }}
                            />
                        </TableCell>
                    }
                    {props.columns.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className='hidden'>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    };

    return (
        <div className='tableWrapper'>
            <div className='tableWrapper__table'>
                <div className='tableWrapper__table__content'>
                    <TableContainer>
                        <Table aria-label='table' size='small'>
                            {renderTableHead()}
                            <TableBody>
                                {stableSort(props.rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        if (props.linkRows && row.url) {
                                            // Row is link.
                                            return (
                                                <TableRow
                                                    hover
                                                    className='pointer'
                                                    onClick={() => {history.push(row.url)}}
                                                    key={`${row[Object.keys(row)[0]]}${index}`}
                                                >
                                                    {renderCellsForRow(row)}
                                                </TableRow>
                                            );
                                        } else {
                                            // Row is selectable.
                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.id)}
                                                    role='checkbox'
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={`${row[Object.keys(row)[0]]}${index}`}
                                                    selected={isItemSelected}
                                                >
                                                    {(props.onSelect && typeof props.onSelect === 'function' && row.id) &&
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </TableCell>
                                                    }
                                                    {renderCellsForRow(row)}
                                                </TableRow>
                                            );
                                        }
                                    })}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component='div'
                            count={props.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

/**
 * Helper function.
 */
const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

/**
 * Helper function.
 */
const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

/**
 * Helper function.
 */
const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

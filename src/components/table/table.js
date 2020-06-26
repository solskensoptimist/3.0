import React, {useState} from 'react';
import {tc} from 'helpers';
import history from '../../router_history';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';

/**
 * Table component.
 *
 * Rows can be selectable, if so provide onSelect function and id property for every row.
 * Rows can be navigation links, if so each row has to have a url property.
 * TODO: make cells editable...
 *
 * Two examples on how to use this component, first with rows that are links, second with selectable rows:
 *      <Table columns={tableHelper.getFleetColumns(state.props.historic)} onSelect={_onSelect} rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}/>
 *      <Table columns={tableHelper.getFleetColumns(state.props.historic)} rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}/>
 *
 * @param props.onSelect - func (optional) - Provide this function when rows are to be selectable, this function receives the selected ids array. Note that every row object must have an 'id' property with a unique value.
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
 *  @param props.rowsPerPage - number (optional)
 */
export default (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage ? props.rowsPerPage : 10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [query, setQuery] = React.useState('');
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
                rows.push(<TableCell align={column.numeric ? 'right' : 'left'} key={`${row[prop]}${index}`}>{row[prop]}</TableCell>);
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
                                {stableSort(props.rows, getComparator(order, orderBy), query)
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => {
                                                    if (row.url) {
                                                        return history.push(row.url);
                                                    }
                                                }}
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={`${row[Object.keys(row)[0]]}${index}`}
                                                selected={isItemSelected}
                                            >
                                                {(props.onSelect && typeof props.onSelect === 'function' && row.id) &&
                                                    <TableCell>
                                                        <Checkbox
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                return handleClick(e, row.id);
                                                            }}
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </TableCell>
                                                }
                                                {renderCellsForRow(row)}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='tableWrapper__table__footer'>
                    <div className='tableWrapper__table__footer__left'>
                        <input className={(query && query.length) ? 'activeInputField' : null} type='text' placeholder={tc.placeholderSearchTable} onChange={(e) => {setQuery(e.target.value)}} value={query}/>
                    </div>
                    <div className='tableWrapper__table__footer__middle'>
                        <div className='tableWrapper__table__footer__middle__rowsPerPage'>
                            {tc.rowsPerPage}:
                            <span className={(rowsPerPage === 5) ?
                                'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                  onClick={() => {setRowsPerPage(5)}}>5</span>
                            <span className={(rowsPerPage === 10) ?
                                'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                  onClick={() => {setRowsPerPage(10)}}>10</span>
                            <span className={(rowsPerPage === 25) ?
                                'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                  onClick={() => {setRowsPerPage(25)}}>25</span>
                        </div>
                    </div>
                    <div className='tableWrapper__table__footer__right'>
                        <TablePagination
                            labelDisplayedRows={({from, to, count}) => `${from} - ${to} ${tc.of.toLowerCase()} ${count}`}
                            rowsPerPageOptions={[null]}
                            component='div'
                            count={props.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
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
const stableSort = (array, comparator, query) => {
    // First filter on search query.
    if (query && query.length) {
        array = array.filter((row) => {
            let hit = false;
            for (const prop in row) {
                if (typeof row[prop] === 'string' && row[prop].toLowerCase().includes(query.toLowerCase())) {
                    hit = true;
                }
            }

            return hit;
        });
    }

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

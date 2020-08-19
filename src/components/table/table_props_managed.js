import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import history from '../../router_history';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const useStyles = makeStyles({
    body: {
        cursor: 'pointer',
    },
});

/**
 * Table component with props to manage pagination, rowsPerPage, search and sorting.
 * Other than that, basically the same as <Table>.
 *
 * Use this component when amount of rows could possibly be too many to save in local storage (like for example in /prospektera/resultat), I.E. 500+ rows or something like that.
 * Make a backend call for every nextPage/prevPage to provide new rows.
 * Which means filter on search query is done backend aswell (optional to provide props.search).
 * And sorting on columns is also done backend, if props.sort is provided.
 *
 * Rows can be selectable, if so provide onSelect function and 'id' property for every row.
 * If a row have a 'url' property the row is going to be a navigation link.
 *
 * Cells is not editable in this component.
 *
 * @param props.onSelect - func (optional) - Provide this function when rows are to be selectable, this function receives the selected ids array. Note that every row object must have an 'id' property with a unique value and you have to provide props.selected array.
 * @param props.columns - array - See <Table> for columns example.
 * @param props.query - string - Search query.
 * @param props.pageChange - func - Called when page changes.
 * @param props.rows - array - See <Table> for rows example.
 * @param props.rowsPerPage - number - Rows per page.
 * @param props.rowsPerPageChange - func - When rows per page changes.
 * @param props.search - func (optional) - Called when search input have value.
 * @param props.selected - array (optional) - If we wanna use selection, provide array with selected ids.
 * @param props.sort - func - Called when a column header is clicked.
 * @param props.total - number - Number of rows total.
 */
export const TablePropsManaged = (props) => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [query, setQuery] = React.useState(props.query ? props.query : '');
    const [selected, setSelected] = React.useState([]);
    const classes = useStyles();

    useEffect(() => {
        setSelected(props.selected ? props.selected : []);
    }, [props.selected]);

    useEffect(() => {
        setQuery(props.query ? props.query : '');
    }, [props.query]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        if (typeof props.pageChange === 'function') {
            props.pageChange(newPage);
        }
    };

    const handleRowsPerPageChange = event => {
        if (props.rowsPerPageChange === 'function') {
            props.rowsPerPageChange(parseInt(event.target.value, 10));
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        if (typeof props.sort === 'function') {
            props.sort({order: isAsc ? 'desc' : 'asc', orderBy: property});
        }
    };

    const handleSelect = (event, id) => {
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

        if (props.onSelect && typeof props.onSelect === 'function') {
            props.onSelect(newSelected);
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = props.rows.map((n) => n.id);
            if (props.onSelect && typeof props.onSelect === 'function') {
                props.onSelect(newSelected);
            }
        } else {
            if (props.onSelect && typeof props.onSelect === 'function') {
                props.onSelect([]);
            }
        }
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
                            onChange={handleSelectAll}
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
                            <TableBody className={(props.rows && props.rows[0] && props.rows[0].url) ? classes.body : null}>
                                {props.rows.map((row, index) => {
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
                                                            return handleSelect(e, row.id);
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
                        {(typeof props.search === 'function') &&
                            <input
                                className={(query && query.length) ? 'activeInputField' : null} type='text'
                                placeholder={tc.placeholderSearchTable}
                                onChange={(e) => {
                                    props.search(e.target.value);
                                }}
                                value={query}
                            />
                        }
                    </div>
                    <div className='tableWrapper__table__footer__middle'>
                        {(typeof props.rowsPerPageChange === 'function') &&
                            <div className='tableWrapper__table__footer__middle__rowsPerPage'>
                                {tc.rowsPerPage}:
                                <span className={(props.rowsPerPage === 5) ?
                                    'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                    'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                      onClick={() => {props.rowsPerPageChange(5)}}>5</span>
                                <span className={(props.rowsPerPage === 10) ?
                                    'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                    'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                      onClick={() => {props.rowsPerPageChange(10)}}>10</span>
                                <span className={(props.rowsPerPage === 25) ?
                                    'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                    'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                      onClick={() => {props.rowsPerPageChange(25)}}>25</span>
                                <span className={(props.rowsPerPage === 50) ?
                                    'tableWrapper__table__footer__middle__rowsPerPage__optionActive' :
                                    'tableWrapper__table__footer__middle__rowsPerPage__option'}
                                      onClick={() => {props.rowsPerPageChange(50)}}>50</span>
                            </div>
                        }
                    </div>
                    <div className='tableWrapper__table__footer__right'>
                        <TablePagination
                            labelDisplayedRows={({from, to, count}) => `${from} - ${to} ${tc.of.toLowerCase()} ${count}`}
                            rowsPerPageOptions={[null]}
                            component='div'
                            count={props.total}
                            rowsPerPage={props.rowsPerPage}
                            page={page}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

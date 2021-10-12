import React, {useState, useEffect} from 'react';
import Dashboard from '../../../layouts/Dashboard/Dashboard';
import {NavLink} from "react-router-dom";
import {useDispatch} from "react-redux"
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Loader from '../../../components/UI/Loader/Loader';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from "@material-ui/icons/Edit";
import axios from "../../../axios/configuratedAxios";
import {useConfirm} from "material-ui-confirm";
import {useToasts} from 'react-toast-notifications';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

function createData(
  name,
  email,
  telephone_number,
  oblast,
  city,
  address,
  id,
) {
  return {
    city,
    email,
    oblast,
    telephone_number,
    name,
    address,
    id
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {id: 'name', numeric: false, disablePadding: true, label: 'Название'},
  {id: 'email', numeric: true, disablePadding: false, label: 'Email'},
  {id: 'oblast', numeric: true, disablePadding: false, label: 'Область'},
  {id: 'telephone_number', numeric: true, disablePadding: false, label: 'Телефон'},
  {id: 'city', numeric: true, disablePadding: false, label: 'Город'},
  {id: 'address', numeric: true, disablePadding: false, label: 'Адрес'},
  {id: 'actions', numeric: true, disablePadding: false, label: 'Действия'},
];

function EnhancedTableHead(props) {
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'выбрать все транзакции'}}
            style={{color: "rgb(17, 82, 147)"}}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    {
      color: "rgb(32, 64, 105) !important",
      backgroundColor: `${lighten(theme.palette.primary.dark, 0.85)} !important`,
    },
  title: {
    flex: '1 1 100%',
  },
}));


const EnhancedTableToolbar = (props) => {
  const {addToast} = useToasts();
  const dispacth = useDispatch();
  const classes = useToolbarStyles();
  const {numSelected, selected, setLoading, deleteRequestBranch} = props;

  const confirm = useConfirm();

  const deleteRows = (selected) => {
    confirm({description: `Удалить филиал(ы)?`})
      .then(() => {
        setLoading(true)
        selected.forEach((id, index) => {
          deleteRequestBranch(id);
        })
      });
  }
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} выбрано
          <Tooltip title="Delete">
            <IconButton
              onClick={() => deleteRows(selected)}
              aria-label="delete">
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

        </Typography>
      )}
      <Button

        component={NavLink}
        to="/branches/add" variant="contained" style={{fontSize: "14px", color: "white"}} color="primary">
        Добавить
      </Button>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function AdminsList() {

  const [loading, setLoading] = useState(true)
  const {addToast} = useToasts();

  const [branchesList, setBranchesList] = useState(null);

  const [errorDialog, setErrorDialog] = useState(false)

  async function fetchBranches(message) {
    try {
      const response = await axios.get(`/branches/`);
      setLoading(false);
      setBranchesList(response.data.results);
    } catch (error) {
      setErrorDialog(true)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchBranches();
  }, []);

  const rows = branchesList ? branchesList.map(branch => createData(
    branch.name,
    branch.email,
    branch.telephone_number,
    branch.oblast,
    branch.city,
    branch.address,
    branch.id,
  )) : [];

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('branch');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  async function deleteRequestBranch(id) {
    try {
      await axios.delete(`/branches/${id}/`).then(() => {
        setTimeout(()=>{
          fetchBranches("after delete")
          setLoading(false)
        }, 1000)
        setSelected([])
      })
    } catch (error) {
      error !== null && addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
      setLoading(false)
    }
  }

  const confirm = useConfirm();

  function confirmToDelete(id) {
    confirm({description: `Удалить филиал(ы)?`})
      .then(() => {
        setLoading(true)
        selected.forEach(() => {
          deleteRequestBranch(id);
        })
      });
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Dashboard>
      <div className={classes.root}>
        {loading &&
        <Loader/>
        }
        <Dialog
          open={errorDialog}
          onClose={() => setErrorDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <h6 style={{color: "#dc004e"}}>Ошибка!</h6>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar deleteRequestBranch={deleteRequestBranch} numSelected={selected.length}
                                selected={selected} setLoading={setLoading}/>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              {rows.length ? <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          style={isItemSelected ? {backgroundColor: "rgb(17, 82, 147, 0.15)"} : {backgroundColor: "#fff"}}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              onClick={(event) => handleClick(event, row.id)}
                              checked={isItemSelected}
                              inputProps={{'aria-labelledby': labelId}}
                              style={{color: "rgb(32, 64, 105)"}}
                            />
                          </TableCell>
                          <TableCell style={{color: "rgb(17, 82, 147)"}} component={NavLink} to={`/branches/${row.id}/`}
                                     as="th" id={labelId} scope="row" padding="none">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.email}</TableCell>
                          <TableCell align="right">
                            {
                              row.oblast === "IK"
                                ? "Ыссык-Кульская"
                                : row.oblast === "CH"
                                ? "Чуйская"
                                : row.oblast === "NR"
                                  ? "Нарынская"
                                  : row.oblast === "TS"
                                    ? "Таласская"
                                    : row.oblast === "JL"
                                      ? "Джалал-Абадская"
                                      : row.oblast === "BT"
                                        ? "Баткенская"
                                        : "Ошская"
                            }
                          </TableCell>
                          <TableCell align="right">{row.telephone_number}</TableCell>
                          <TableCell align="right">{row.city}</TableCell>
                          <TableCell align="right">{row.address}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="edit"
                              component={NavLink}
                              to={{
                                pathname: `/branches/update/${row.id}`,
                                id: row.id,
                              }}
                            >
                              <EditIcon/>
                            </IconButton>

                            <IconButton aria-label="delete" onClick={() => confirmToDelete(row.id)}>
                              <DeleteIcon/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{height: "200px"}}>
                      <TableCell align="center">
                      </TableCell>
                      <TableCell colSpan={5}/>
                    </TableRow>
                  )}
                </TableBody>
                : <TableRow style={{height: "200px"}}>
                  <TableCell align="center">
                  </TableCell>
                  <TableCell colSpan={5}/>
                </TableRow>
              }
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            nextIconButtonText={"След"}
            backIconButtonText={"Пред"}
            labelRowsPerPage={"Количество строк"}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>`${from}-${to} из ${count !== -1 ? count :to}`}
          />
        </Paper>
        <FormControlLabel
          control={<Switch style={{color: "rgb(17, 82, 147)"}} checked={dense} onChange={handleChangeDense}/>}
          label="Сократить ряды"
        />
      </div>
    </Dashboard>
  );
}
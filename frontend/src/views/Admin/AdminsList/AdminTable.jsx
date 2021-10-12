import React, {useState, useEffect} from 'react';
import Dashboard from '../../../layouts/Dashboard/Dashboard';
import {
  fetchUsers,
  clearUsers,
  fetchPageUsers,
  fetchOrderedUsers,
  fetchBranches,
  clearBreadcrumbs,
} from "../../../redux/actions";
import {NavLink} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux"
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
import MenuItem from '@material-ui/core/MenuItem';
import DialogContentText from '@material-ui/core/DialogContentText';
import TableSearch from '../../../components/TableSearch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

function createData(
  first_name,
  last_name,
  email,
  phone_number,
  birth_date,
  gender,
  branch_id,
  userId,
  adminId,
  branch_name
) {
  return {
    gender,
    last_name,
    email,
    birth_date,
    phone_number,
    first_name,
    branch_id,
    userId,
    adminId,
    branch_name
  };
}

const headCells = [
  {id: 'first_name', numeric: false, disablePadding: true, label: 'Имя'},
  {id: 'last_name', numeric: true, disablePadding: false, label: 'Фамилия'},
  {id: 'email', numeric: true, disablePadding: false, label: 'Email'},
  {id: 'birth_date', numeric: true, disablePadding: false, label: 'Дата рождения'},
  {id: 'phone_number', numeric: true, disablePadding: false, label: 'Телефон'},
  {id: 'gender', numeric: true, disablePadding: false, label: 'Пол'},
  {id: 'branch', numeric: true, disablePadding: false, label: 'Филиал'},
  {id: 'actions', numeric: true, disablePadding: false, label: 'Действия'},
];

const genderOptions = [
  {key: 'Мужчина', value: 'M'},
  {key: 'Женщина', value: 'F'}
]

function EnhancedTableHead(props) {
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, orderUsers, currentFilteringField, setCurrentFilteringField} = props;

  const fieldFilterHandler = (clickedField) => {
    if (clickedField === currentFilteringField) {
      orderUsers(clickedField, 'desc');
      setCurrentFilteringField('');
    } else {
      orderUsers(clickedField, 'asc');
      setCurrentFilteringField(clickedField);
    }
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
              direction={currentFilteringField === headCell.id ? 'desc' : 'asc'}
              onClick={() => fieldFilterHandler(headCell.id)}
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
  const confirm = useConfirm();
  const {numSelected, selected, deleteRows, inputValue, setInputValue, setBranch, branch, setGender, gender} = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const dispatchedBranches = useSelector(
    (state) =>
      state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches ? (dispatchedBranches.results || []).map(branch => ({
    id: branch.id,
    value: branch.id,
    label: branch.name
  })) : [];

  
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      }, 'd-flex flex-column flex-md-row align-items-end align-items-md-center' )}
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

      <FormControl className={[classes.formControl, 'mx-auto mr-md-3', 'col-12 col-md-2',].join(' ')}>
        <InputLabel id="demo-simple-select-label">Пол</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={gender}
          onChange={e => {
            e.target.value === "ALL"
              ? setGender('')
              : setGender(e.target.value)
          }}
        >
          <MenuItem key='ALL' value='ALL'>{'Все'}</MenuItem>
          {
            genderOptions.map(option => {
              return (
                <MenuItem key={option.key} value={option.value}>{option.key}</MenuItem>
              )
            })}
        </Select>
      </FormControl>
      <FormControl className={[classes.formControl, 'mx-auto mr-md-3', 'col-12 col-md-2',].join(' ')}>
        <InputLabel id="demo-simple-select-label">Филиал</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={branch}
          onChange={e => {
            e.target.value === "ALL"
              ? setBranch('')
              : setBranch(e.target.value)
          }}
        >
          <MenuItem key='ALL' value='ALL'>{'Все'}</MenuItem>
          {
            branches.map(option => {
              return (
                <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
              )
            })}
        </Select>
      </FormControl>

      <TableSearch
        label="Поиск администратора"
        url="/users/students/"
        inputValue={inputValue}
        handleInputChange={e => setInputValue(e.target.value)}
      />
      <Button
        component={NavLink}
        className="my-3 ml-3"
        to="/addAdmin" variant="contained" style={{fontSize: "14px", color: "white", minWidth: 'auto'}} color="primary">
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

export default function AdminsList(props) {

  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState('');
  const {addToast} = useToasts();
  const [errorDialog, setErrorDialog] = useState(false)
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const [currentFilteringField, setCurrentFilteringField] = useState('');
  const [branch, setBranch] = useState('');
  const [gender, setGender] = useState('');

  const orderUsers = (fieldName, order) => {
    setLoading(true);
    const pageNumber = page + 1;

    const orderDirection = order === 'asc'
      ? `users/administrators/?search=${inputValue}&user__gender=${gender}&user__branch=${branch}&ordering=user__${fieldName}`
      : `users/administrators/?search=${inputValue}&user__gender=${gender}&user__branch=${branch}&ordering=-user__${fieldName}`;
    const orderingUrl = pageNumber > 1 ? `${orderDirection}&page=${pageNumber}` : orderDirection;

    if (pageNumber > 1) {
      dispatch(fetchOrderedUsers(orderingUrl, "admins"))
        .then(() => setLoading(false));
    } else {
      dispatch(fetchUsers(orderingUrl, "admins"))
        .then(() => setLoading(false));
    }
  }

  useEffect(() => {
    dispatch(clearUsers("admins"));
    dispatch(clearBreadcrumbs());
  }, [dispatch])

  const error = useSelector(state => state.getUsers.admins.error && state.getUsers.admins.error);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPageUsers("users/administrators", "admins")).then(() => setLoading(false));
    return () => {
      if (props.history.location.pathname !== '/adminsList') {
        dispatch(clearUsers("admins"));
      }
    }
  }, [props.history.location.pathname]);

  useEffect(() => {
    dispatch(clearUsers("admins"));
    dispatch(
      fetchUsers(
        `users/administrators/?search=${inputValue}&user__gender=${gender}&user__branch=${branch}`, "admins"
      )
    )
      .then(() => setLoading(false));
    setPage(0)
  }, [branch, dispatch, gender, inputValue])

  useEffect(() => {
    if (error !== null) {
      setErrorDialog(true)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }, [addToast, error]);

  const adminsList = useSelector(state => state.getUsers.admins.data && state.getUsers.admins.data);

  const rows = adminsList ? (adminsList.results || []).map(admin => createData(
    admin.user.first_name,
    admin.user.last_name,
    admin.user.email,
    admin.user.phone_number,
    admin.user.birth_date,
    admin.user.gender,
    admin.user.branch,
    admin.user.id,
    admin.id,
    admin.branch_name
  )) : [];

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('user');
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
      const newSelects = rows.map((n) => n.userId);
      setSelected(newSelects);
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
    const estimatedPageItemsNumber = (+newPage) * rowsPerPage;
    const stateItemsAmount = adminsList.results.length;

    if (estimatedPageItemsNumber+1 > stateItemsAmount) {
      setLoading(true); 
      dispatch(fetchPageUsers(adminsList.next, 'admins')).then(() => setLoading(false));
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const getDate = (date) => {
    const d = new Date(date);
    const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const month = (d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1);

    return `${day}-${month}-${d.getFullYear()}`
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  async function deleteUser(id) {
    try {
      setLoading(true)
      await axios.delete(`/users/${id}/`).then(() => setLoading(false))
    } catch (error) {
      console.log(error)
    }
    dispatch(fetchUsers('users/administrators', "admins")).then(() => setLoading(false));
  }


  const deleteRows = (selected) => {
    confirm({description: `Удалить администратора?`})
      .then(() => {
        setLoading(true)
        selected.forEach((id, index) => {
          deleteUser(id);
        })
        setSelected([])
      });
  }

  const handleDeleteAdmin = (e, {userId, first_name, last_name}) => {
    e.preventDefault();
    confirm({
      description: `Удалить студента ${first_name} ${last_name}?`,
    })
      .then(() => deleteUser(userId))
      .catch(() => {
        /* ... */
      });
  };

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
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            setLoading={setLoading}
            inputValue={inputValue}
            deleteRows={deleteRows}
            setInputValue={setInputValue}
            branch={branch}
            setBranch={setBranch}
            gender={gender}
            setGender={setGender}
          />
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
                orderUsers={orderUsers}
                currentFilteringField={currentFilteringField}
                setCurrentFilteringField={setCurrentFilteringField}
                rowCount={rows.length}
              />
              {rows.length ? <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.userId);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.userId}
                          selected={isItemSelected}
                          style={isItemSelected ? {backgroundColor: "rgb(17, 82, 147, 0.15)"} : {backgroundColor: "#fff"}}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              onClick={(event) => handleClick(event, row.userId)}
                              checked={isItemSelected}
                              inputProps={{'aria-labelledby': labelId}}
                              style={{color: "rgb(32, 64, 105)"}}
                            />
                          </TableCell>
                          <TableCell style={{color: "rgb(17, 82, 147)"}} component={NavLink} to={`/adminDetail/${row.adminId}/`}
                                     as="th" id={labelId} scope="row" padding="none">
                            {row.first_name}
                          </TableCell>
                          <TableCell align="right">{row.last_name}</TableCell>
                          <TableCell align="right">{row.email}</TableCell>
                          <TableCell align="right">{getDate(row.birth_date)}</TableCell>
                          <TableCell align="right">{row.phone_number ? row.phone_number : 'Не указан'}</TableCell>
                          <TableCell align="right">{row.gender === "M" ? "Муж" : "Жен"}</TableCell>
                          <TableCell style={{color: '#0056b3'}} component={NavLink} to={`/branches/${row.branch_id}`}
                                     align="right">{row.branch_name}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="edit"
                              component={NavLink}
                              to={`/adminUpdate/${row.adminId}`}
                            >
                              <EditIcon/>
                            </IconButton>
                            <IconButton aria-label="delete" onClick={(e) => handleDeleteAdmin(e, row)}>
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
                   {/* no data */}
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
            page={page}
            nextIconButtonText={"След"}
            backIconButtonText={"Пред"}
            labelRowsPerPage={"Количество строк"}
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
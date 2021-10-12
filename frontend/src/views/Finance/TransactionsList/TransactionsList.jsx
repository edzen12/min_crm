import React, {useState, useEffect} from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import {
  clearTransaction,
  fetchPageTransactions,
  fetchBranches,
  fetchOrderedTransactions,
  fetchTransactionsListAction,
  clearBreadcrumbs,
} from "../../../redux/actions";
import {NavLink} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import {lighten, makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Loader from "../../../components/UI/Loader/Loader";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from '@material-ui/core/Button';
import axios from "../../../axios/configuratedAxios";
import {useConfirm} from "material-ui-confirm";
import TableSearch from '../../../components/TableSearch';
import {fetchCourses} from "../../../redux/actions";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {useToasts} from "react-toast-notifications";

function createData(
  transaction_id,
  name,
  price,
  created_date,
  transaction_type,
  id,
  wallet_name,
  branch_id,
  branch_name,
) {
  return {transaction_id, name, price, created_date, transaction_type, wallet_name, id, branch_id, branch_name};
}

const headCells = [

  {
    id: "transaction_id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Название",
  },
  {id: "amount", numeric: false, disablePadding: false, label: "Цена"},
  {id: "created_date", numeric: true, disablePadding: false, label: "Дата создания"},
  {id: "transaction_type", numeric: false, disablePadding: false, label: "Тип"},
  {id: "wallet_name", numeric: false, disablePadding: false, label: "Кошелек"},
  {id: "branch", numeric: false, disablePadding: false, label: "Филиал"},
  {id: "actions", numeric: false, disablePadding: false, label: "Действия"},
];

const transaction_typeOptions = [
  {key: 'Доход', value: 'INCOME'},
  {key: 'Расход', value: 'EXPENSE'},
  {key: 'Оплата ст.', value: 'STUDENT'},
]

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    currentFilteringField,
    setCurrentFilteringField,
    orderCourses
  } = props;

  const fieldFilterHandler = (clickedField) => {
    if (clickedField === currentFilteringField) {
      orderCourses(clickedField, 'desc');
      setCurrentFilteringField('');
    } else {
      orderCourses(clickedField, 'asc');
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
            inputProps={{"aria-label": "выбрать все транзакции"}}
            style={{color: "rgb(17, 82, 147)"}}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
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
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight: {
    color: "rgb(32, 64, 105) !important",
    backgroundColor: `${lighten(theme.palette.primary.dark, 0.85)} !important`,
  },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const classes = useToolbarStyles();
  const {numSelected, selected, deleteRows, inputValue, setInputValue, setBranch, branch, setStatus, transaction_type} = props;

  useEffect(() => {
    dispatch(fetchBranches());
  }, []);

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
      }, 'd-flex flex-column flex-md-row align-items-end align-items-md-center')}
    >

      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} выбрано
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteRows(selected)} aria-label="delete">
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      <FormControl className={[classes.formControl, 'mx-auto mr-md-3', 'col-12 col-md-2',].join(' ')}>
        <InputLabel id="demo-simple-select-label">Тип тран.</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={transaction_type}
          onChange={e => {
            e.target.value === "ALL"
              ? setStatus('')
              : setStatus(e.target.value)
          }}
        >
          <MenuItem key='ALL' value='ALL'>{'Все'}</MenuItem>
          {
            transaction_typeOptions.map(option => {
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
        label="Поиск транзакции"
        url="/finances/transactions/"
        inputValue={inputValue}
        handleInputChange={e => setInputValue(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        className="my-3 ml-3"
        onClick={() => setOpen(true)}
        style={{fontSize: "14px", color: "white", minWidth: 'auto'}}
        EnhancedTableToolbar
      >
        Добавить
      </Button>
      <FormControl>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          IconComponent={() => (<div/>)}
          disableUnderline
          freeSolo
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <MenuItem component={NavLink} to="finances/addIncomes" value={10}>Доход</MenuItem>
          <MenuItem component={NavLink} to="finances/addExpenses" value={20}>Расход</MenuItem>
          <MenuItem component={NavLink} to="finances/addStudentPayments" value={30}>Оплата ст.</MenuItem>
        </Select>
      </FormControl>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function CoursesList(props) {
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [currentFilteringField, setCurrentFilteringField] = useState('');
  const [branch, setBranch] = useState('');
  const [transaction_type, setStatus] = useState('');
  const {addToast} = useToasts();
  const [paginationUrls, setPaginationUrls] = useState({
    next: '',
    prev: '',
    current: '/finances/transactions/'
  });
  const dispatch = useDispatch();

  const orderCourses = (fieldName, order) => {
    setLoading(true);
    const pageNumber = page + 1;

    const orderDirection = order === 'asc'
      ? `finances/transactions/?&branch=${branch}&search=${inputValue}&ordering=${fieldName}&transaction_type=${transaction_type}`
      : `finances/transactions/?&branch=${branch}&search=${inputValue}&ordering=-${fieldName}&transaction_type=${transaction_type}`;
    const orderingUrl = pageNumber > 1 ? `${orderDirection}&page=${pageNumber}` : orderDirection;

    if (pageNumber > 1) {
      dispatch(fetchOrderedTransactions(orderingUrl))
        .then(() => setLoading(false));
    } else {
      dispatch(fetchTransactionsListAction(orderingUrl))
        .then(() => setLoading(false));
    }
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPageTransactions(paginationUrls.current)).then(() => setLoading(false));
    return () => {
      if (props.history.location.pathname !== 'finances/transactions/') {
        dispatch(clearTransaction());
      }
    }
  }, [paginationUrls.current]);

  const error = useSelector(
    (state) =>
      state.finance.transactionsList.error
  );

  useEffect(() => {
    dispatch(clearTransaction());
    dispatch(
      fetchTransactionsListAction(
        `finances/transactions/?transaction_type=${transaction_type}&branch=${branch}&search=${inputValue}&transaction_type=${transaction_type}`
      )
    )
      .then(() => setLoading(false));
    setPage(0)
  }, [branch, dispatch, transaction_type, inputValue])

  useEffect(() => {
    if (error !== null) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }, [addToast, error]);

  useEffect(() => {
    dispatch(clearBreadcrumbs())
    dispatch(clearTransaction());
  }, [dispatch])

  const transactions = useSelector(
    (state) =>
      state.finance.transactionsList.data
  );

  console.log(
    "transactions: ", transactions
  )

  if (transactions && !(!!paginationUrls.next) && transactions.next) {
    setPaginationUrls({
      ...paginationUrls,
      next: transactions.next.split('api/')[1]
    });
  }

  if (transactions && !(!!paginationUrls.prev) && transactions.previous) {
    setPaginationUrls({
      ...paginationUrls,
      prev: transactions.previous.split('api/')[1]
    });
  }

  const classes = useStyles();

  const rows = transactions ? (transactions.results || []).map((transaction) =>
      createData(
        transaction.transaction_id,
        transaction.title,
        transaction.amount,
        transaction.created_date,
        transaction.transaction_type,
        transaction.id,
        transaction.wallet_name,
        transaction.branch,
        transaction.branch_name,
      )
    )
    : [];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("user");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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
        selected.slice(selectedIndex + 1)
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

  const isSelected = (id) => {
    return selected.indexOf(id) !== -1;
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  async function deleteTransaction(id) {
    setLoading(true)
    try {
      await axios.delete(`finances/transactions/${id}/`)
      dispatch(fetchPageTransactions('finances/transactions/'));
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  const deleteRows = (selected) => {
    confirm({description: `Удалить курсы?`}).then(() => {
      setLoading(true);
      selected.forEach((id, index) => {
        deleteTransaction(id);
      });
      setSelected([])
    });
  };

  const getDate = (date) => {
    const d = new Date(date);
    const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const month = (d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1);

    return `${day}-${month}-${d.getFullYear()}`
  }

  const confirm = useConfirm();
  const handleDeleteTransaction = (e, {id, name}) => {
    e.preventDefault();
    confirm({
      description: `Удалить транзакцию ${name} ?`,
    })
      .then(() => {
        deleteTransaction(id)
        dispatch(fetchTransactionsListAction('finances/transactions/'));
      })
      .catch(() => {
        /* ... */
      });
  };

  return (
    <Dashboard>
      <div className={classes.root}>
        {loading && <Loader/>}
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            setLoading={setLoading}
            inputValue={inputValue}
            setInputValue={setInputValue}
            branch={branch}
            setBranch={setBranch}
            transaction_type={transaction_type}
            setStatus={setStatus}
            deleteRows={deleteRows}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
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
                orderCourses={orderCourses}
                currentFilteringField={currentFilteringField}
                setCurrentFilteringField={setCurrentFilteringField}
              />
              {rows.length ? (
                <TableBody>
                  {rows
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
                          key={row.name}
                          selected={isItemSelected}
                          style={
                            isItemSelected
                              ? {backgroundColor: "rgb(17, 82, 147, 0.15)"}
                              : {backgroundColor: "#fff"}
                          }
                        >
                          {/*transaction_id*/}
                          <TableCell padding="checkbox">
                            <Checkbox
                              onClick={(event) => handleClick(event, row.id)}
                              checked={isItemSelected}
                              inputProps={{"aria-labelledby": labelId}}
                              style={{color: "rgb(32, 64, 105)"}}
                            />
                          </TableCell>
                          <TableCell
                            id={labelId}
                            scope="row"
                            padding="none"
                            style={{color: "rgb(17, 82, 147)"}}
                            component={NavLink}
                            to={`transactions/${row.id}/`}
                            as="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.transaction_id}
                          </TableCell>
                          <TableCell align="left">
                            {row.name}
                          </TableCell>
                          <TableCell align="left">{row.price} $</TableCell>
                          <TableCell align="center">
                            {getDate(row.created_date)}
                          </TableCell>
                          <TableCell align="left">
                            {row.transaction_type === "INCOME"
                              ? "Доход"
                              : row.transaction_type === "EXPENSE"
                                ? "Расход"
                                : row.transaction_type === "STUDENT"
                                  ? "Оплата ст."
                                  : ""}
                          </TableCell>
                          <TableCell align="center">
                            {getDate(row.wallet_name)}
                          </TableCell>
                          <TableCell style={{color: '#0056b3'}} component={NavLink} to={`/branches/${row.branch_id}`}
                                     align="left">{row.branch_name ? row.branch_name : "Не указано"}</TableCell>
                          <TableCell align="left">
                            <IconButton
                              aria-label="edit"
                              component={NavLink}
                              to={`/transactions/update/${row.id}/`}
                            >
                              <EditIcon/>
                            </IconButton>

                            <IconButton aria-label="delete" onClick={(e) => handleDeleteTransaction(e, row)}>
                              <DeleteIcon/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{height: "200px"}}>
                      <TableCell align="center"></TableCell>
                      <TableCell colSpan={5}/>
                    </TableRow>
                  )}
                </TableBody>
              ) : (
                <TableRow style={{height: "200px"}}>
                  <TableCell align="center">{/* no data */}</TableCell>
                  <TableCell colSpan={5}/>
                </TableRow>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20]}
            count={transactions ? transactions.count : 0}
            rowsPerPage={rowsPerPage}
            nextIconButtonText={"След"}
            backIconButtonText={"Пред"}
            labelRowsPerPage={"Количество строк"}
            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count !== -1 ? count : to}`}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={
            <Switch
              style={{color: "rgb(17, 82, 147)"}}
              checked={dense}
              onChange={handleChangeDense}
            />
          }
          label="Сократить ряды"
        />
      </div>
    </Dashboard>
  );
}

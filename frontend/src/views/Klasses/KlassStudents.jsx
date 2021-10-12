import React, {useState, useEffect} from 'react';
import Dashboard from '../../layouts/Dashboard/Dashboard';
import {fetchWalletListAction} from "../../redux/actions";
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
import Loader from '../../components/UI/Loader/Loader';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from "../../axios/configuratedAxios";
import {useConfirm} from "material-ui-confirm";
import {fetchUsers} from "../../redux/actions";
import EditIcon from "@material-ui/icons/Edit";


function createData(
  first_name,
  last_name,
  email,
  phone_number,
  birth_date,
  gender,
  studentId,
  userId,
) {
  return {
    gender,
    last_name,
    email,
    birth_date,
    phone_number,
    first_name,
    studentId,
    userId,
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


function EnhancedTableHead(props) {
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const [headCells, setHeadCells] = useState([
    {id: 'first_name', numeric: false, disablePadding: true, label: 'Имя'},
    {id: 'last_name', numeric: true, disablePadding: false, label: 'Фамилия'},
    {id: 'email', numeric: true, disablePadding: false, label: 'Email'},
    {id: 'birth_date', numeric: true, disablePadding: false, label: 'Дата рождения'},
    {id: 'phone_number', numeric: true, disablePadding: false, label: 'Телефон'},
    {id: 'gender', numeric: true, disablePadding: false, label: 'Пол'},
    {id: 'actions', numeric: true, disablePadding: false, label: 'Действия'},
  ])

  const userData = useSelector((state) => state.personalData.userData.data);

  if(userData && !userData.is_administrator && headCells.findIndex(item => item.id === 'actions') !== -1){
    setHeadCells(headCells.filter(item => item.label !== 'Действия'))
  }

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
  const dispacth = useDispatch();
  const classes = useToolbarStyles();
  const {numSelected, selected, setLoading} = props;

  async function deleteRequestExpense(id) {
    try {
      await axios.delete(`/finances/wallets/${id}/`).then(() => setLoading(false))
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    dispacth(fetchWalletListAction());
  };

  const confirm = useConfirm();

  const deleteRows = (selected) => {
    confirm({description: `Удалить транзакции?`})
      .then(() => {
        setLoading(true)
        selected.forEach((id, index) => {
          deleteRequestExpense(id);
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
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

        </Typography>
      )}
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
    marginBottom: theme.spacing(2),
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

export default function KlassStudents(props) {
  const studentsKlassesId = props.match.params.id;
  ////////////////////////////////////////////////////////////////////////////

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers(`klasses/${studentsKlassesId}/students`, 'students')).then(() => setLoading(false));
  }, [dispatch, studentsKlassesId]);

  const students = useSelector(state => state.getUsers.students && state.getUsers.students.data);
  const rows = students ? (students.results || []).map(item => createData(
    item.user.first_name,
    item.user.last_name,
    item.user.email,
    item.user.phone_number,
    item.user.birth_date,
    item.user.gender,
    item.id,
    item.user.id,
  )) : [];
  ////////////////////////////////////////////////////////////////////////////

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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const getDate = (date) => {
    const d = new Date(date);
    const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const month = (d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1);
    return `${day}-${month}-${d.getFullYear()}`;
  }

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <Dashboard>
      <div className={classes.root}>
        {loading &&
        <Loader/>
        }
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} selected={selected} setLoading={setLoading}/>
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

                          <TableCell style={{color: "rgb(17, 82, 147)"}} as="th" id={labelId} scope="row" padding="none">
                            <NavLink to={`/student/${row.studentId}/`}>
                              {row.first_name}
                            </NavLink>
                          </TableCell>

                          <TableCell align="right" as="td">{row.last_name}</TableCell>
                          <TableCell align="right" as="td">{row.email}</TableCell>
                          <TableCell align="right" as="td">{getDate(row.birth_date)}</TableCell>
                          <TableCell align="right" as="td">{row.phone_number ? row.phone_number : 'Не указан'}</TableCell>
                          <TableCell align="right" as="td">{row.gender === "M" ? "Муж" : "Жен"}</TableCell>

                      {userData && userData.is_administrator ? (
                          <TableCell align="right">
                            <IconButton
                              aria-label="edit"
                              component={NavLink}
                              to={`/student/update/${row.studentId}`}
                            >
                              <EditIcon/>
                            </IconButton>
                          </TableCell>
                      ) : null}
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
            rowsPerPageOptions={[5, 10, 25]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
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
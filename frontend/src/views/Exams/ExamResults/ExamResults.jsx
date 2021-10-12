import React, {useState, useEffect} from 'react';
import Dashboard from '../../../layouts/Dashboard/Dashboard';
import {setExamsResultsId, setBreadcrumbs} from "../../../redux/actions";
import {Link, NavLink} from "react-router-dom";
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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import axios from "../../../axios/configuratedAxios";
import Button from "@material-ui/core/Button";
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useConfirm } from "material-ui-confirm";

function createData(
  name,
  email,
  checked,
  grade,
  id
) {
  return {
    name,
    email,
    checked,
    grade,
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
  {id: 'name', numeric: false, disablePadding: true, label: 'ФИО'},
  {id: 'email', numeric: true, disablePadding: false, label: 'Email'},
  {id: 'grade', numeric: true, disablePadding: false, label: 'Оценка'},
  {id: 'checked', numeric: true, disablePadding: false, label: 'Статус'},
  {id: "actions", numeric: true, disablePadding: false, label: "Действия"},
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
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{'aria-label': 'выбрать все транзакции'}}
            style={{color: "rgb(17, 82, 147)"}}
          /> */}
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
  const classes = useToolbarStyles();
  const {numSelected, selected} = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} выбрано
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

export default function ExamsResults(props) {


  const [loading, setLoading] = useState(true)
  const [examResults, setExamResults] = useState(null);

  const userData = useSelector((state) => state.personalData.userData.data);

  let examId = props.match.params.id;
  const fetchExamResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`examinations/exams/${examId}`);
      setLoading(false);
      setExamResults({
        ...response.data,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchExamResults();
  }, []);

  useEffect(() => {
    examResults && dispatch(setBreadcrumbs(
      [
        {title: "Экзамены", to: "/exams"},
        {title: examResults.title, to: ""},
      ]
    ))
    dispatch(setExamsResultsId(examId));
  }, [examResults]);

  const rows = [];
  examResults && examResults.user_exams.forEach(
    r => {
      rows.push(
        createData(
          `${r.user ? r.user.last_name + ' ' + r.user.first_name : r.email}`,
          r.email,
          r.checked?"Проверен":"Не проверен",
          r.grade?r.grade:"",
          r.id,
        )
      )
    });
  ////////////////////////////////////////////////////////////////////////////

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('user');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();

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

  const deleteExam = async (id) => {
    try {
      const { data } = await axios.delete(`examinations/user-exams/${id}`);
      fetchExamResults();
    } catch (error) {
      console.log(error);
    }
  }

  const confirm = useConfirm();
  const handleDeleteExam = (e, id) => {
    e.preventDefault();
    confirm({
      description: `Удалить ответы?`,
    })
      .then(() => deleteExam(id))
      .catch(() => {
      });
  };

  return (
    <Dashboard>
      <div className={classes.root}>
        {loading &&
        <Loader/>
        }
        <Paper className={classes.paper}>
          <EnhancedTableToolbar 
            numSelected={selected.length} 
            selected={selected}
            setLoading={setLoading}
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
                        >
                          <TableCell padding="checkbox">
                          </TableCell>

                          <TableCell as="th" id={labelId} scope="row" padding="none">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.email}</TableCell>
                          <TableCell align="right">{row.grade}</TableCell>
                          <TableCell align="right">{row.checked}</TableCell>
                          <TableCell align="right">
                            {/* <Button
                              variant="contained"
                              color="primary"
                              style={{color: '#fff'}}
                              component={NavLink}
                              disabled={userData.is_administrator ? false : userData?.email !== row.email}
                            >
                              Посмотреть
                            </Button> */}

                              <IconButton to={`/exams-result/user/${row.id}/`} disabled={userData.is_administrator || userData.is_trainer ? false : userData?.email !== row.email} component={NavLink}>
                                <VisibilityIcon color={`${userData.is_administrator ? 'primary' : 'gray'}`}/>
                              </IconButton>

                            {
                              userData.is_administrator || userData.is_trainer ? (
                                <IconButton style={{marginLeft: 5}} onClick={(e) => handleDeleteExam(e, row.id)}>
                                  <DeleteIcon/>
                                </IconButton>
                              ) : null
                            }
                            
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
                :
                <TableRow style={{height: "200px"}}>
                  <TableCell align="center">{/* no data */}</TableCell>
                  <TableCell colSpan={5}/>
                </TableRow>
              }
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 20]}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={"Количество строк"}
            labelDisplayedRows={({ from, to, count }) =>`${from}-${to} из ${count !== -1 ? count :to}`}
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
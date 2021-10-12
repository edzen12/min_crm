import React, { useState, useEffect } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import {
  fetchKlasses,
  fetchPageKlasses,
  fetchBranches,
  clearKlasses,
  fetchOrderedKlasses, clearBreadcrumbs
} from "../../../redux/actions";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
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
import { useConfirm } from "material-ui-confirm";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TableSearch from "../../../components/TableSearch";
import {useToasts} from "react-toast-notifications";

function createData(
  klass_id,
  students,
  schedule,
  classroom_link,
  klass,
  trainer,
  course,
  id
) {
  return { klass_id, students, schedule, classroom_link, klass, trainer, course, id };
}


const baseOptions = [
  {key: '9 - класс', value: '9'},
  {key: '10 - класс', value: '10'},
  {key: '11 - класс', value: '11'},
]

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    orderKlasses,
    currentOrderingField,
    setCurrentOrderingField,
  } = props;
  
  const fieldFilterHandler = (clickedField) => {
    if (clickedField === currentOrderingField) {
      orderKlasses(clickedField, "desc");
      setCurrentOrderingField("");
    } else {
      orderKlasses(clickedField, "asc");
      setCurrentOrderingField(clickedField);
    }
  };

  const [headCells, setHeadCells] = useState([
    {
      id: "klass_id",
      numeric: false,
      disablePadding: true,
      label: "ID класса",
    },
    { id: "students", numeric: false, disablePadding: false, label: "Студенты" },
    { id: "schedule", numeric: false, disablePadding: false, label: "Расписание" },
    { id: "classroom_link", numeric: false, disablePadding: false, label: "Google classroom" },
    { id: "base", numeric: false, disablePadding: false, label: "База" },
    { id: "trainers", numeric: false, disablePadding: false, label: "Менторы" },
    { id: "course__title", numeric: false, disablePadding: false, label: "Курс" },
    { id: "actions", numeric: false, disablePadding: false, label: "Действия" },
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
            inputProps={{ "aria-label": "выбрать все транзакции" }}
            style={{ color: "rgb(17, 82, 147)" }}
          />
        </TableCell>
        {headCells.map((headCell, userData) => 
        <TableCell
          key={headCell.id}
          align={headCell.numeric ? "right" : "left"}
          padding={headCell.disablePadding ? "none" : "default"}
          sortDirection={orderBy === headCell.id ? order : false}
        >
          <TableSortLabel
            active={orderBy === headCell.id}
            direction={currentOrderingField === headCell.id ? "desc" : "asc"}
            onClick={() => fieldFilterHandler(headCell.id)}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <span className={classes.visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </span>
            ) : (
              ""
            )}
          </TableSortLabel>
        </TableCell>
      )}
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
  formControl: {
    margin: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const EnhancedTableToolbar = (props) => {
  const dispatch = useDispatch();
  const classes = useToolbarStyles();
  const {
    numSelected, 
    selected, 
    deleteRows,
    inputValue, 
    setInputValue, 
    setBranch, 
    branch, 
    setBase, 
    base
  } = props;

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

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      },
      "d-flex flex-column flex-md-row align-items-end align-items-md-center"
      )}
    >

      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} выбрано

          {userData && userData.is_administrator ? (
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteRows(selected)} aria-label="delete">
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
          ) : null}
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
        <InputLabel id="demo-simple-select-label">Статус</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={base}
          onChange={e => {
            e.target.value === "ALL"
              ? setBase('')
              : setBase(e.target.value)
          }}
        >
          <MenuItem key='ALL' value='ALL'>{'Все'}</MenuItem>
          {
            baseOptions.map(option => {
              return (
                <MenuItem key={option.key} value={option.value}>{option.key}</MenuItem>
              )
            })}
        </Select>
      </FormControl>

      {userData && userData.is_administrator ? (
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
      ) : null}


      <TableSearch
        label="Поиск класса"
        url="/klasses/"
        inputValue={inputValue}
        handleInputChange={e => setInputValue(e.target.value)}
      />
      
      {userData && userData.is_administrator ? (
      <Button
        variant="contained"
        color="primary"
        className="my-3 ml-3"
        component={NavLink}
        style={{fontSize: "14px", color: "white", minWidth: 'auto'}}
        to='/klasses/addKlassPart1/'
        as="span"
        EnhancedTableToolbar
      >
        Добавить
      </Button>
      ) : null}
      
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

export default function KlassesList(props) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentOrderingField, setCurrentOrderingField] = useState('');
  const [branch, setBranch] = useState('');
  const {addToast} = useToasts();
  const [base, setBase] = useState('');
  
  const dispatch = useDispatch();

  const orderKlasses = (fieldName, order) => {
    setLoading(true);
    const pageNumber = page + 1;

    const orderDirection =
      order === "asc"
        ? `klasses/?&branch=${branch}&search=${inputValue}&ordering=${fieldName}&base=${base}`
        : `klasses/?&branch=${branch}&search=${inputValue}&ordering=-${fieldName}&base=${base}`;
    const orderingUrl =
      pageNumber > 1 ? `${orderDirection}&page=${pageNumber}` : orderDirection;

    if (pageNumber > 1) {
      dispatch(fetchOrderedKlasses(orderingUrl)).then(() => setLoading(false));
    } else {
      dispatch(fetchKlasses(orderingUrl)).then(() => setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(clearKlasses());
    dispatch(clearBreadcrumbs());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPageKlasses("klasses/")).then(() => setLoading(false));
    return () => {
      if (props.history.location.pathname !== "/klasses") {
        dispatch(clearKlasses());
      }
    };
  }, [props.history.location.pathname]);

  useEffect(() => {
    dispatch(clearKlasses());
    dispatch(
      fetchKlasses(
        `klasses/?base=${base}&branch=${branch}&search=${inputValue}`
      )
    ).then(() => setLoading(false));
    setPage(0);
  }, [branch, base, inputValue, dispatch]);

  const klassesList = useSelector(
    (state) => state.klasses.klasses.data && state.klasses.klasses.data
  );

  const rows = klassesList
    ? (klassesList.results || []).map((klass) =>
        createData(
          klass.klass_id,
          'Студенты',
          'Расписание',
          klass.classroom_link,
          klass.base,
          `${klass.trainers[0] ? klass.trainers[0].user.first_name : ''}`,
          klass.course,
          klass.id
        )
      )
    : [];

  const classes = useStyles();
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
    const estimatedPageItemsNumber = +newPage * rowsPerPage;
    const stateItemsAmount = klassesList.results.length;

    if (estimatedPageItemsNumber + 1 > stateItemsAmount) {
      setLoading(true);
      dispatch(fetchPageKlasses(klassesList.next)).then(() => setLoading(false));
    }
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

  async function deleteKlass(klassId) {
    setLoading(true)
    try {
      await axios.delete(`/klasses/${klassId}/`)
      setLoading(false);
      fetchKlasses()
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  const deleteRows = (selected) => {
    confirm({ description: `Удалить классы?` }).then(() => {
      setLoading(true);
      selected.forEach((id, index) => {
        deleteKlass(id);
      });
      setSelected([])
    });
  };

  const confirm = useConfirm();
  const handledeleteKlass = (e, {id, klass_id}) => {
    e.preventDefault();
    confirm({
      description: `Удалить курс ${klass_id} ?`,
    })
      .then(() => {
        deleteKlass(id);
        fetchKlasses();
      })
      .catch(() => {
        /* ... */
      });
  };

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <Dashboard>
      <div className={classes.root}>
        {loading && <Loader />}
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            setLoading={setLoading}
            inputValue={inputValue}
            setInputValue={setInputValue}
            branch={branch}
            setBranch={setBranch}
            base={base}
            setBase={setBase}
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
                orderKlasses={orderKlasses}
                currentOrderingField={currentOrderingField}
                setCurrentOrderingField={setCurrentOrderingField}
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
                          key={row.id}
                          selected={isItemSelected}
                          style={
                            isItemSelected
                              ? { backgroundColor: "rgb(17, 82, 147, 0.15)" }
                              : { backgroundColor: "#fff" }
                          }
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                              style={{ color: "rgb(32, 64, 105)" }}
                            />
                          </TableCell>
                          <TableCell
                            id={labelId}
                            scope="row"
                            padding="none"
                            style={{ color: "rgb(17, 82, 147)" }}
                            component={NavLink}
                            to={`/klasses/${row.id}/`}
                            as="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.klass_id}
                          </TableCell>
                          <TableCell 
                            align="left"
                            component={NavLink}
                            to={`/klassStudents/${row.id}/`}
                            >
                            <Typography variant="p" color="primary">
                              {row.students}
                            </Typography> 
                          </TableCell>
                          <TableCell 
                            align="left"
                            component={NavLink}
                            to={`/klass-schedule/${row.id}/`}
                            >
                            {row.schedule} 
                          </TableCell>
                          <TableCell align="left">
                            <a href={row.classroom_link} target="_blank">
                            {row.classroom_link.length > 30 ? row.classroom_link.substring(0, 29) + "..." : row.classroom_link} 
                            </a>
                          </TableCell>
                          <TableCell align="left">
                            {row.klass} класс
                          </TableCell>
                          <TableCell align="left">{row.trainer}</TableCell>
                          <TableCell align="left">{row.course ? row.course.title : ''}</TableCell>
                          {userData && userData.is_administrator ? (
                          <TableCell align="left">
                            <IconButton 
                              aria-label="edit"
                              component={NavLink}
                              to={`/klasses/update/${row.id}/`}
                              >
                              <EditIcon />
                            </IconButton>

                            <IconButton aria-label="delete" onClick={(e) => handledeleteKlass(e, row)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          ) : null}

                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: "200px" }}>
                      <TableCell align="center"></TableCell>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              ) : (
                <TableRow style={{ height: "200px" }}>
                  <TableCell align="center">{/* no data */}</TableCell>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20]}
            count={klassesList ? klassesList.count : 0}
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
          control={
            <Switch
              style={{ color: "rgb(17, 82, 147)" }}
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

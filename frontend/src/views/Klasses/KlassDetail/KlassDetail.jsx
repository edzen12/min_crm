import React, {useEffect, useState} from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import style from "./klass-detail.module.css";
import {NavLink} from "react-router-dom";
import {useConfirm} from "material-ui-confirm";
import {useToasts} from 'react-toast-notifications';
import {
  Box,
  Paper,
  IconButton,
  Typography, Link,
} from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import "fontsource-roboto";
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    overflow: "auto",
    maxHeight: "300px",
  },
  tableCont: {
    maxHeight: "300px"
  },
});

function KlassDetail(props) {
  const {addToast} = useToasts();
  const classes = useStyles();
  const [errorDialog, setErrorDialog] = useState(false)

  let klassId = props.match.params.id;

  const [loading, setLoading] = useState(false);
  const [klassDetail, setKlassDetail] = useState(null);
  const dispatch = useDispatch();

  async function fetchKlassDetail() {
    setLoading(true);
    try {
      const response = await axios.get(`/klasses/${klassId}`);
      setLoading(false);
      setKlassDetail(response.data);
    } catch (error) {
      setLoading(false);
      setErrorDialog(true)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    fetchKlassDetail();
  }, []);
  useEffect(() => {
    klassDetail && dispatch(setBreadcrumbs(
      [
        {title: "Классы", to: "/klasses"},
        {title: klassDetail.klass_id, to: ""},
      ]
    ))
  }, [klassDetail])

  async function deleteRequest() {
    setLoading(true);
    try {
      await axios.delete(`/klasses/${klassId}/`);
      setLoading(false);
      props.history.push("/klasses");
    } catch (error) {
      setLoading(false);
      setErrorDialog(true)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const confirm = useConfirm();
  const confirmDelete = (e) => {
    e.preventDefault();
    confirm({
      description: `Удалить ${klassDetail.klass_id}?`,
    })
      .then(() => deleteRequest())
      .catch(() => {
        /* ... */
      });
  };

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <>
      <Dashboard>
        {loading && (
          <Loader/>
        )}
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

        {klassDetail && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                <h2 style={{
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  marginTop: "20px"
                }}>
                  {klassDetail.klass_id}
                </h2>
                <div className={style.gridCont}>
                  <div>
                    <div classname={style.gridCell}>
                      {userData && userData.is_administrator ? (
                      <div className={style.courseActionBtns}>
                        <IconButton
                          onClick={(e) => confirmDelete(e)}
                          color="primary"
                        >
                          <DeleteIcon color="inherit"/>
                        </IconButton>

                        <IconButton
                          component={NavLink}
                          to={{
                            pathname: `/klasses/update/${klassDetail.id}`,
                            id: klassDetail.id,
                          }}
                          color="primary"
                        >
                          <EditIcon color="inherit"/>
                        </IconButton>
                      </div>
                      ) : null}

                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Филиал
                      </Typography>

                      <Typography variant="body1">
                        {klassDetail.branch_name}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Ссылка на classroom
                      </Typography>

                      {klassDetail.classroom_link ? (
                        <Typography component={Link} href={klassDetail.classroom_link} variant="body1">
                          {klassDetail.classroom_link.length > 30
                            ? klassDetail.classroom_link.substring(0, 29) + "..."
                            : klassDetail.classroom_link}
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      База
                    </Typography>
                    {
                      klassDetail.base ? (
                        <Typography className="mt-1 mb-1" variant="body1">
                          {klassDetail.base} - класс
                        </Typography>
                      ) : <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    }
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      Курс
                    </Typography>
                    {klassDetail.course ? (
                      <Box style={{display: "flex", alignItems: "center"}}>
                        {klassDetail.course.image
                          ? <img style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: "10px"
                          }}
                                 src={klassDetail.course.image} alt=""/>
                          : <div style={{
                            width: "40px",
                            height: "40px",
                            background: "#b5b3b3",
                            borderRadius: "50%",
                            marginRight: "10px"
                          }}/>
                        }
                        <Typography component={NavLink} to={`/courseDetail/${klassDetail.course.id}`} variant="body1">
                          {klassDetail.course.title}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    )}
                  </div>

                </div>
              </Box>
            </Paper>

            <Paper className={style.secondPart}>
              <div className={style.secondPart_mainCont}>
                <div className={style.secontPart_cont}>

                  <div className={`mt-4`}>
                    <Typography className="mb-3" variant="h6">
                      &nbsp; Студенты
                    </Typography>
                    <TableContainer className={`col-lg-8 col-md-12 ${classes.tableCont}`} component={Paper}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>ФИО</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {klassDetail.students.length ? klassDetail.students.map((row, id) => (
                            <TableRow key={id}>
                              <TableCell component="th" scope="row">
                                {`${row.user.first_name} ${row.user.last_name}`}
                              </TableCell>
                              <TableCell component={NavLink} style={{color: "#0056b3"}} to={`/student/${id}`} align="right">{row.user.email}</TableCell>
                            </TableRow>
                          )) : <TableRow>
                            <TableCell component="th" scope="row">
                              ПУСТО
                            </TableCell>
                          </TableRow>
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>

                  <div className={`mt-4`}>
                    <Typography className="mb-3" variant="h6">
                      &nbsp; Менторы
                    </Typography>
                    <TableContainer className={`col-lg-8 col-md-12 ${classes.tableCont}`} component={Paper}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>ФИО</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {klassDetail.trainers.length ? klassDetail.trainers.map((row, id) => (
                            <TableRow key={id}>
                              <TableCell component="th" scope="row">
                                {`${row.user.first_name} ${row.user.last_name}`}
                              </TableCell>
                              <TableCell style={{color: "#0056b3"}} align="right">{row.user.email}</TableCell>
                            </TableRow>
                          )): <TableRow>
                            <TableCell component="th" scope="row">
                              ПУСТО
                            </TableCell>
                            </TableRow>}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>

                </div>
              </div>
            </Paper>
          </Box>
        )}
      </Dashboard>
    </>
  );
}

export default KlassDetail;

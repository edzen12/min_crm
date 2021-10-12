import React, { useEffect, useState } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../../components/UI/Loader/Loader";
import style from "./courseDetail.module.css";
import { NavLink } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { useToasts } from "react-toast-notifications";
import { Box, Paper, IconButton, Typography } from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import PolicyIcon from "@material-ui/icons/Policy";
import HomeIcon from '@material-ui/icons/Home';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import "fontsource-roboto";
import { MonetizationOn } from "@material-ui/icons";
import { TimeIcon } from "@material-ui/pickers/_shared/icons/TimeIcon";
import { setBreadcrumbs } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
    width: "100px",
    color: "#fff",
    borderRadius: "2px",
    padding: "5px",
    margin: "2px",
    background: "#3f51b5",
  },
}));

function CoursesDetail(props) {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [errorDialog, setErrorDialog] = useState(false);

  let courseId = props.match.params.id;

  const [loading, setLoading] = useState(false);
  const [courseDetailData, setCourseData] = useState(null);
  const dispatch = useDispatch();
  async function fetchBranchDetail() {
    setLoading(true);
    try {
      const response = await axios.get(`/courses/${courseId}`);
      setLoading(false);
      setCourseData(response.data);
    } catch (error) {
      setLoading(false);
      setErrorDialog(true);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  useEffect(() => {
    fetchBranchDetail();
  }, []);
  useEffect(() => {
    courseDetailData && dispatch(setBreadcrumbs(
      [
        {title: "Курсы", to: "/courses"},
        {title: courseDetailData.title, to: ""},
      ]
    ))
  }, [courseDetailData]);

  async function deleteRequestBranch() {
    setLoading(true);
    try {
      await axios.delete(`/courses/${courseId}/`);
      setLoading(false);
      props.history.push("/courses");
    } catch (error) {
      setLoading(false);
      setErrorDialog(true);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  const confirm = useConfirm();
  const handleDeleteBranch = (e) => {
    e.preventDefault();
    confirm({
      description: `Удалить ${courseDetailData.title}?`,
    })
      .then(() => deleteRequestBranch())
      .catch(() => {
        /* ... */
      });
  };

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <>
      <Dashboard>
        {loading && <Loader />}

        <Dialog
          open={errorDialog}
          onClose={() => setErrorDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <h6 style={{ color: "#dc004e" }}>Ошибка!</h6>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {courseDetailData && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                {courseDetailData.image ? (
                  <img
                    className={style.img}
                    src={courseDetailData.image}
                    style={{display: 'block', 'margin': '0 auto'}}
                    alt="course-image"
                  />
                ) : (
                  <svg
                    width="100%"
                    height="230px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 3C7.89543 3 7 3.89543 7 5C7 5.74028 7.4022 6.38663 8 6.73244V17.2676C7.4022 17.6134 7 18.2597 7 19C7 20.1046 7.89543 21 9 21C9.74028 21 10.3866 20.5978 10.7324 20H11.9585C14.1676 20 15.9585 18.2091 15.9585 16V14.7324C16.5563 14.3866 16.9585 13.7403 16.9585 13C16.9585 11.8954 16.0631 11 14.9585 11C13.8539 11 12.9585 11.8954 12.9585 13C12.9585 13.7403 13.3607 14.3866 13.9585 14.7324V16C13.9585 17.1046 13.0631 18 11.9585 18H10.7324C10.5568 17.6964 10.3036 17.4432 10 17.2676V6.73244C10.5978 6.38663 11 5.74028 11 5C11 3.89543 10.1046 3 9 3Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <div className={style.gridCont}>
                    <div className={style.gridCell}>
                    {userData && userData.is_administrator ? (
                      <div className={style.courseActionBtns}>
                        <IconButton
                          onClick={(e) => handleDeleteBranch(e)}
                          color="primary"
                        >
                          <DeleteIcon color="inherit" />
                        </IconButton>

                        <IconButton
                          component={NavLink}
                          to={{
                            pathname: `/courses/update/${courseDetailData.id}`,
                            id: courseDetailData.id,
                          }}
                          color="primary"
                        >
                          <EditIcon color="inherit" />
                        </IconButton>
                      </div>
                    ) : null}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      Название
                    </Typography>

                    <Typography variant="body1">
                      {courseDetailData.title}
                    </Typography>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      Ссылка classroom
                    </Typography>
                    <Typography variant="body1">
                      {courseDetailData.program_link}
                    </Typography>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      Филиал
                    </Typography>
                    <Typography variant="body1">
                      {courseDetailData.branch_name ? courseDetailData.branch_name : 'Не указано'}
                    </Typography>
                  </div>

                </div>
              </Box>
            </Paper>

            <Paper className={style.secondPart}>
              <div className={style.secondPart_mainCont}>
                <div className={style.secontPart_cont}>
                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <PolicyIcon />
                        <Typography variant="body1">
                          &nbsp; Статус курса
                        </Typography>
                      </Box>
                    </div>

                    {courseDetailData.status ? (
                      <Typography variant="body1">
                        {courseDetailData.status === "O"
                          ? "Открыт"
                          : courseDetailData.status === "C"
                          ? "Закрыт"
                          : "Идет набор"}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Не указано
                      </Typography>
                    )}
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <MonetizationOn />
                        <Typography variant="body1">&nbsp; Цена</Typography>
                      </Box>
                    </div>

                    {courseDetailData.price ? (
                      <Typography variant="body1">
                        {courseDetailData.price} сом
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    )}
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <TimeIcon />
                        <Typography variant="body1">
                          &nbsp; Продолжительность
                        </Typography>
                      </Box>
                    </div>

                    {courseDetailData.period ? (
                      <Typography variant="body1">
                        {courseDetailData.period} мес
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    )}
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <HomeIcon />
                        <Typography variant="body1">&nbsp; Тэги</Typography>
                      </Box>
                    </div>

                    {courseDetailData.tags ? (
                      <div style={{ display: "flex" }}>
                        {courseDetailData.tags.map((t) => (
                          <Typography
                            component="span"
                            variant="body1"
                            key={t.id}
                            style={{ minWidth: "80px", textAlign: "center" }}
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {t.title}
                          </Typography>
                        ))}
                      </div>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    )}
                  </div>

                  <div
                    style={{ padding: "10px 0 10px 15px" }}
                    className={style.gridCell}
                  >
                    <Typography variant="body1" gutterBottom>
                      <WbIncandescentIcon />
                      &nbsp; Описание
                    </Typography>

                    <Typography variant="body1">
                      {courseDetailData.description
                        ? courseDetailData.description
                        : "Не указано"}
                    </Typography>
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

export default CoursesDetail;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import { makeStyles } from "@material-ui/core/styles";
import style from "./studentDetail.module.css";
import { NavLink } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import {
  Box,
  Button,
  Paper,
  IconButton,
  Link,
  Typography,
} from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import PolicyIcon from "@material-ui/icons/Policy";
import unknownUser from "../../../images/unknownUsers.png";
import TodayIcon from "@material-ui/icons/Today";
import EventIcon from "@material-ui/icons/Event";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import { useToasts } from 'react-toast-notifications';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TelegramIcon from "@material-ui/icons/Telegram";
import {stopLoading} from "../../../redux/actions/createUser";
import {setBreadcrumbs} from "../../../redux/actions";
import FaceIcon from '@material-ui/icons/Face';


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
    width: "auto",
    color: "#fff",
    borderRadius: "2px",
    padding: "5px 10px",
    margin: "2px 7px",
    background: "#3f51b5",
  },
}));

function StudentDetail(props) {

  const classes = useStyles();
  const { addToast } = useToasts()
  let studentId = props.match.params.id;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [studentDetailData, setStudentDetailData] = useState(null);

  async function fetchStudentDetail() {
    try {
      const response = await axios.get(`/users/students/${studentId}/`);
      setLoading(false);
      setStudentDetailData({...response.data})
      await axios.get(
        `klasses/${response.data.klasses[0]}`
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    studentId && fetchStudentDetail();
  }, [studentId]);

  useEffect(() => {
    studentDetailData && dispatch(setBreadcrumbs(
      [
        {title: "????????????????", to: "/studentsList"},
        {title: studentDetailData.user.email, to: ""},
      ]
    ))
  }, [studentDetailData]);

  async function deleteStudent() {
    setLoading(true);
    try {
      await axios.delete(`/users/${studentDetailData.user.id}/`);
      setLoading(false);
      props.history.push("/studentsList");
    } catch (error) {
      console.log(error.response)
      let isEmailError = error.response.data.detail ?? false;
      if(isEmailError){
        dispatch(stopLoading());
      } else {
        dispatch(stopLoading());
        addToast("??????-???? ?????????? ???? ??????!", {
          appearance: "error",
          autoDismiss: true
        })
      }
    }
  }
  const confirm = useConfirm();
  const handleDeleteStudent = (e) => {
    e.preventDefault();
    confirm({
      description: `?????????????? ${studentDetailData.user.first_name} ${studentDetailData.user.last_name}?`,
    })
      .then(() => deleteStudent())
      .catch(() => {
        /* ... */
      });
  };

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <>
      <Dashboard>
        {loading && (
          <Loader />
        )}

        {studentDetailData && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                <img
                  style={{display: 'block', margin: '0 auto'}}
                  className={style.img}
                  src={
                    studentDetailData.user.avatar
                      ? studentDetailData.user.avatar
                      : unknownUser
                  }
                  alt="student-profile-img"
                />
                <div className={style.gridCont}>
                  <div>
                    <div className={style.gridCell}>
                    {userData && userData.is_administrator ? (
                      <div className={style.courseActionBtns}>
                        <IconButton
                          onClick={(e) => handleDeleteStudent(e)}
                          color="primary"
                        >
                          <DeleteIcon color="inherit" />
                        </IconButton>

                        <IconButton
                          component={NavLink}
                          to={{
                            pathname: `/student/update/${studentDetailData.id}`,
                            email: studentDetailData.user.email,
                          }}
                          color="primary"
                        >
                          <EditIcon color="inherit" />
                        </IconButton>
                      </div>
                    ) : null}
                    </div>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ID ????????????????
                    </Typography>

                    <Typography variant="body1">
                      {`${studentDetailData.student_id}`}
                    </Typography>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ??????
                    </Typography>

                    <Typography variant="body1">
                      {`${studentDetailData.user.first_name} ${studentDetailData.user.last_name}`}
                    </Typography>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ???????? ????????????????
                    </Typography>

                    {studentDetailData.user.birth_date ? (
                      <Typography variant="body1">
                        {studentDetailData.user.birth_date}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      Email
                    </Typography>

                    <Typography variant="body1">
                      {studentDetailData.user.email}
                    </Typography>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ??????
                    </Typography>

                    <Typography variant="body1">
                      {studentDetailData.user.gender === "M" && "??????????????"}
                      {studentDetailData.user.gender === "F" && "??????????????"}
                    </Typography>
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ??????. ??????.
                    </Typography>

                    {studentDetailData.user.phone_number ? (
                      <Typography variant="body1">
                        {studentDetailData.user.phone_number}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????????????? ??????.
                    </Typography>

                    {studentDetailData.user.second_phone_number ? (
                      <Typography variant="body1">
                        {studentDetailData.user.second_phone_number}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">Instagram &nbsp;</Typography>
                      <InstagramIcon />
                    </Box>

                    {studentDetailData.user.instagram ? (
                      <Typography variant="body1">
                        <Link href={studentDetailData.user.instagram}>
                          ???????????? ???? ??????????????????...
                        </Link>
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">Facebook &nbsp;</Typography>
                      <FacebookIcon />
                    </Box>

                    {studentDetailData.user.facebook ? (
                      <Typography variant="body1">
                        <Link href={studentDetailData.user.facebook}>
                          ???????????? ???? ??????????????...
                        </Link>
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">Linkedin &nbsp;</Typography>
                      <LinkedInIcon />
                    </Box>

                    {studentDetailData.user.linkedin ? (
                      <Typography variant="body1">
                        <Link href={studentDetailData.user.linkedin}>
                          ???????????? ???? ????????????????...
                        </Link>
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">Telegram &nbsp;</Typography>
                      <TelegramIcon />
                    </Box>

                    {studentDetailData.user.telegram ? (
                      <Typography variant="body1">
                        <Link href={studentDetailData.user.telegram}>
                          ???????????? ???? ????????????????...
                        </Link>
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>
                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ????????????
                    </Typography>

                    {studentDetailData.user.branch ? (
                      <Typography  variant="body1">{studentDetailData.branch_name}</Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.secontPart_cont}>
                    <Typography variant="h6">???????????????????? ????????????</Typography>

                    <div className={style.secondPart_cell}>
                      <div className={style.secondPart_miniCont}>
                        <Box display="flex" alignItems="center">
                          <PolicyIcon />
                          <Typography variant="body1">
                            &nbsp; ?????? ??????????
                          </Typography>
                        </Box>
                      </div>

                      {studentDetailData.authority ? (
                        <Typography variant="body2">
                          {studentDetailData.authority}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          ???? ??????????????
                        </Typography>
                      )}
                    </div>

                    <div className={style.secondPart_cell}>
                      <div className={style.secondPart_miniCont}>
                        <Box display="flex" alignItems="center">
                          <TodayIcon />
                          <Typography variant="body1">
                            &nbsp; ???????? ????????????
                          </Typography>
                        </Box>
                      </div>

                      {studentDetailData.date_of_issue ? (
                        <Typography variant="body2">
                          {studentDetailData.date_of_issue}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          ???? ??????????????
                        </Typography>
                      )}
                    </div>

                    <div className={style.secondPart_cell}>
                      <div className={style.secondPart_miniCont}>
                        <Box display="flex" alignItems="center">
                          <EventIcon />
                          <Typography variant="body1">
                            &nbsp; ???????? ????????????????
                          </Typography>
                        </Box>
                      </div>

                      {studentDetailData.date_of_expire ? (
                        <Typography variant="body2">
                          {studentDetailData.date_of_expire}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          ???? ??????????????
                        </Typography>
                      )}
                    </div>

                    <div className={style.secondPart_cell}>
                      <div className={style.secondPart_miniCont}>
                        <Box display="flex" alignItems="center">
                          <AccountBoxIcon />
                          <Typography variant="body1">
                            &nbsp; ?????????? ????????????????
                          </Typography>
                        </Box>
                      </div>

                      {studentDetailData.passport_number ? (
                        <Typography variant="body2">
                          {studentDetailData.passport_number}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          ???? ??????????????
                        </Typography>
                      )}
                    </div>

                    <div className={style.secondPart_cell}>
                      <div className={style.secondPart_miniCont}>
                        <Box display="flex" alignItems="center">
                          <SettingsOverscanIcon />
                          <Typography variant="body1">
                            &nbsp; ???????? ????????????????
                          </Typography>
                        </Box>
                      </div>

                      {studentDetailData.passport_scan ? (
                        <Button
                          component={Link}
                          href={studentDetailData.passport_scan}
                          variant="contained"
                          color="primary"
                          className={style.secondPart_btn}
                          target="_blank"
                          style={{ textDecoration: "none" }}
                        >
                          ??????????????
                        </Button>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          ???? ????????????????????
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className={style.secontPart_cont}>
                    <Typography variant="h6">??????????????</Typography>

                    <div className={style.secondPart_cell}>
                      <div className={style.secondPart_miniCont}>
                        <Box display="flex" alignItems="center">
                          <AttachMoneyIcon />
                          <Typography variant="body1">
                            &nbsp; ???????????????? ??????????????????
                          </Typography>
                        </Box>
                      </div>

                      {studentDetailData.contract_amount ? (
                        <Typography variant="body2">
                          {studentDetailData.contract_amount}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          ???? ??????????????
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </Box>
            </Paper>

            <Paper className={style.secondPart}>
              <div className={style.secondPart_mainCont}>
                <div className={style.secontPart_cont}>
                  <h4 className={style.h4}>??????. ???????????? ????????????????</h4>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????? ????????????
                    </Typography>

                    {studentDetailData.mother_name ? (
                      <Typography variant="body1">
                        {studentDetailData.mother_name}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????? ???????????????? ????????????
                    </Typography>

                    {studentDetailData.mother_phone_number ? (
                      <Typography variant="body1">
                        {studentDetailData.mother_phone_number}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????? ????????
                    </Typography>

                    {studentDetailData.father_name ? (
                      <Typography variant="body1">
                        {studentDetailData.father_name}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????? ???????????????? ????????
                    </Typography>

                    {studentDetailData.father_phone_number ? (
                      <Typography variant="body1">
                        {studentDetailData.father_phone_number}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????????? ?????????? (???????? ????????)
                    </Typography>

                    {studentDetailData.quit_reason ? (
                      <Typography variant="body1">
                        {studentDetailData.quit_reason}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ??????????????????????
                    </Typography>

                    {studentDetailData.residence ? (
                      <Typography variant="body1">
                        {studentDetailData.residence}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????? ???????????? ?????????? ??????????????
                    </Typography>

                    {studentDetailData.place_of_work ? (
                      <Typography variant="body1">
                        {studentDetailData.place_of_work}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????? ?????? ??????????
                    </Typography>

                    {studentDetailData.info_from ? (
                      <Typography variant="body1">
                        {studentDetailData.info_from === "A"
                          ? "????????????????"
                          : studentDetailData.info_from === "SN"
                          ? "???????????????????? ????????"
                          : studentDetailData.info_from === "G"
                          ? "Google"
                          : studentDetailData.info_from === "SM"
                          ? "??????"
                          : studentDetailData.info_from === "O"
                          ? "????????????"
                          : ""}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ??????????
                    </Typography>

                    {studentDetailData.klass ? (
                        // component={NavLink} to={`/klasses/${studentDetailData.klass}`}
                      <Typography  variant="body1">{studentDetailData.klass_name}</Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????? ????????????????????
                    </Typography>

                    {studentDetailData.address ? (
                      <Typography variant="body1">
                        {studentDetailData.address}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????? ????????????????
                    </Typography>

                    {studentDetailData.residence_address ? (
                      <Typography variant="body1">
                        {studentDetailData.residence_address}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ???????? ??????????????????????
                    </Typography>

                    {studentDetailData.enrollment_date ? (
                      <Typography variant="body1">
                        {studentDetailData.enrollment_date}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ???????? ???????????? ??????????
                    </Typography>

                    {studentDetailData.study_start_date ? (
                      <Typography variant="body1">
                        {studentDetailData.study_start_date}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ???????? ?????????????????? ??????????
                    </Typography>

                    {studentDetailData.finish_date ? (
                      <Typography variant="body1">
                        {studentDetailData.finish_date}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ????????????
                    </Typography>

                    {studentDetailData.status ? (
                      <Typography variant="body1">
                        {studentDetailData.status === "W"
                          ? "?? ????????????????"
                          : studentDetailData.status === "G"
                          ? "??????????????"
                          : studentDetailData.status === "L"
                          ? "????????"
                          : studentDetailData.status === "A"
                          ? "????????????????"
                          : ""}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ?????????????? ??????????????????????
                    </Typography>

                    {studentDetailData.english_level ? (
                      <Typography variant="body1">
                        {studentDetailData.english_level === "E"
                          ? "Elementary"
                          : studentDetailData.english_level === "B"
                          ? "Beginner"
                          : studentDetailData.english_level === "I"
                          ? "Intermediate"
                          : studentDetailData.english_level === "A"
                          ? "Advanced"
                          : ""}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ???????????? ????????????????????
                    </Typography>

                    {studentDetailData.country ? (
                      <Typography variant="body1">
                        {studentDetailData.country}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ??????????????
                    </Typography>

                    {studentDetailData.region ? (
                      <Typography variant="body1">
                        {studentDetailData.region === "IK"
                          ? "??????????-????????????????"
                          : studentDetailData.region === "CH"
                          ? "??????????????"
                          : studentDetailData.region === "NR"
                          ? "??????????????????"
                          : studentDetailData.region === "TS"
                          ? "??????????????????"
                          : studentDetailData.region === "JL"
                          ? "????????????-????????????????"
                          : studentDetailData.region === "OS"
                          ? "????????????" : "????????????????????"
                          }
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <FaceIcon />
                        <Typography variant="body1">&nbsp; ??????????????????</Typography>
                      </Box>
                    </div>

                    {studentDetailData.category ? (
                      <div style={{ display: "flex", flexWrap: 'wrap' }}>
                        {studentDetailData.category.map((category, index) => (
                          <Typography
                            component="span"
                            variant="body1"
                            key={index}
                            style={{ minWidth: "100px", textAlign: "center" }}
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {category.title}
                          </Typography>
                        ))}
                      </div>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
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

export default StudentDetail;

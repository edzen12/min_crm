import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import axios from "../../../../axios/configuratedAxios";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import Loader from "../../../../components/UI/Loader/Loader";
import { makeStyles } from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PaymentIcon from '@material-ui/icons/Payment';
import PersonIcon from '@material-ui/icons/Person';
import { useConfirm } from "material-ui-confirm";
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import { useToasts } from 'react-toast-notifications';
import ChatIcon from '@material-ui/icons/Chat';
import {
  Paper,
  Typography,
  Divider,
  Link,
  Box,
  Button,
  IconButton
} from "@material-ui/core";

const useStyles = makeStyles({
  mainCont: {
    minHeight: "85vh",
    padding: "15px"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  spaceBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

function StudentPaymentsDetail(props) {

  const student = useSelector(state => state.student.studentDetail.data && state.student.studentDetail.data);

  const { addToast } = useToasts();
  const studentPaymentsDetailId = props.id;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const wallet = useSelector(state => state.finance.walletDetail.data);
  function GetWalletDetail(id) {
    return (
      wallet && <>
        <Typography variant="h6" className={`ml-1  ${classes.alignCenter}`}>
          {wallet.name}
        </Typography>
        <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
          {wallet.account_number}
        </Typography>
      </>
    )
  }

  const course = useSelector(state => state.courses.courseDetail.data && state.courses.courseDetail.data);
  function GetCourseDetail() {
    return (
      course
        ?
        <Typography variant="h5" className={`ml-1 mb-1  ${classes.alignCenter}`}>
          {course.title}
        </Typography>
        : <Typography variant="body-1" className={`ml-1 mb-4 ${classes.alignCenter}`}>
          ???????? ???? ????????????
        </Typography>
    )
  }

  function GetStudentDetail() {
    return (
      student
        ?
        <Typography variant="h5" className={`ml-1 mb-1  ${classes.alignCenter}`}>
          {student.student_id}
        </Typography>
        : <Typography variant="body-1" className={`ml-1 mb-4 ${classes.alignCenter}`}>
          ?????????????? ???? ????????????
        </Typography>
    )
  }

  function GetCreatedTime(props) {
    const createdTime = new Date(props.date);
    const date = `
    ${createdTime.getFullYear()}.${createdTime.getMonth() < 9 ? "0" + (createdTime.getMonth() + 1) : (createdTime.getMonth() + 1)}.${createdTime.getDate() < 10 ? "0" + createdTime.getDate() : createdTime.getDate()} 
    ${createdTime.getHours() < 10 ? "0" + createdTime.getHours() :
        createdTime.getHours()}:${createdTime.getMinutes() < 10 ? "0" + createdTime.getMinutes() : createdTime.getMinutes()}`;
    return (
      <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
        {date}
      </Typography>
    );
  };

  async function deleteRequestWallet() {
    setLoading(true)
    try {
      await axios.delete(`/finances/transactions/${studentPaymentsDetailId}/`)
      setLoading(false);
      window.location = "/transactions"
    } catch (error) {
      addToast("??????-???? ?????????? ???? ??????!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const confirm = useConfirm();
  function handleDeleteStudentPaymentDetail(e, name) {
    e.preventDefault();
    confirm({ description: `?????????????? ${name}?` })
      .then(() => deleteRequestWallet())
      .catch(() => {
        /* ... */
      });
  }

  const studentPaymentsData = useSelector(state => state.finance.transactionsDetail && state.finance.transactionsDetail.data);
  const classes = useStyles();
  return (
    <Dashboard>
      <div style={{ minHeight: "80vh", position: "relative" }} container justify="center">
        {loading &&
          <div>
            <Loader />
          </div>
        }
        {studentPaymentsData && (
          <Paper className={classes.mainCont}>
            <Typography variant="h4" className={classes.spaceBetween}>
              {studentPaymentsData.title}
              <div>
                <IconButton onClick={e => handleDeleteStudentPaymentDetail(e, studentPaymentsData.title)} color="primary">
                  <DeleteIcon color="inherit" />
                </IconButton>

                <IconButton component={NavLink} to={`/transactions/update/${studentPaymentsDetailId}`} color="primary">
                  <EditIcon color="inherit" />
                </IconButton>
              </div>
            </Typography>
            <Typography className={`mb-3 ${classes.alignCenter}`} variant="h6">
              <MonetizationOnIcon className="mr-1" fontSize="medium" />
              {`${studentPaymentsData.amount} KGS`}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PersonIcon className="mr-1" />
              ????????????????????????:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {studentPaymentsData.user}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PaymentIcon className="mr-1" />
              ????????????????????:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {studentPaymentsData.transaction_id}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <AccessTimeIcon className="mr-1" />
              ??????????:
            </Typography>
            <GetCreatedTime date={studentPaymentsData.created_date} />
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <LaptopMacIcon className="mr-1" />
              ????????:
            </Typography>
            <GetCourseDetail />
            <Divider />

            <Box className={`mt-4  mb-4 `}>
              <Box className={`${classes.alignCenter}`}>
                <SettingsOverscanIcon className="mr-1" />
                <Typography variant="h6">
                  ???????? ?????? ???????? ????????
                        </Typography>
              </Box>
              <Box className={"mb-3"} >
                <Typography variant="body-1">
                  {studentPaymentsData.confirmation ? studentPaymentsData.confirmation : "???????? ??????????????????????!"}
                </Typography>
              </Box>
              <Box className={"col-lg-2 col-md-4 p-0 col-sm-12"}>
                <Button
                  component={Link}
                  href={studentPaymentsData.confirmation}
                  variant="contained"
                  color="primary"
                  className={`${classes.alignCenter}`}
                  target="_blank"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  ??????????????
              </Button>
              </Box>
            </Box>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <ChatIcon className="mr-1" />
              ??????????????????????:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {
                studentPaymentsData.comment ?
                  studentPaymentsData.comment :
                  "???????????????????? ??????"
              }
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PaymentIcon className="mr-1" />
              ??????????????:
            </Typography>
            <GetWalletDetail />
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PersonIcon className="mr-1" />
              ??????????????:
            </Typography>
            <GetStudentDetail />
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PaymentIcon className="mr-1" />
              ??????????:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {
                studentPaymentsData.method &&
                  studentPaymentsData.method === "TRANSFER" ?
                  "????????????????" :
                  studentPaymentsData.method === "DEPOSIT" ?
                    "????????????????????" :
                    "?????????? ???? ????????????"
              }
            </Typography>
            <Divider />
          </Paper>
        )}
      </div>
    </Dashboard >
  )
}

export default StudentPaymentsDetail;
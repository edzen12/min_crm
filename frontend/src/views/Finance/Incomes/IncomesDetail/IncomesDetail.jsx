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

function IncomesDetail(props) {

  const dispatch = useDispatch();
  const { addToast } = useToasts();

  useEffect( ()=> {
    setLoading(false)
  }, [] )
  const incomesDetailId = props.id;
  const [loading, setLoading] = useState(true);

  const wallet = useSelector(state => state.finance.walletDetail.data);

  function GetCreatedTime(props) {
    const createdTime = new Date(props.date);
    const date = `
    ${createdTime.getFullYear()}.${createdTime.getMonth() < 9 ? "0" + (createdTime.getMonth()+1) : (createdTime.getMonth()+1)}.${createdTime.getDate() < 10 ? "0" + createdTime.getDate() : createdTime.getDate()} 
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
      await axios.delete(`/finances/transactions/${incomesDetailId}/`)
      setLoading(false);
      window.location = "/transactions"
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const confirm = useConfirm();
  function handleDeleteExpense(e, name) {
    e.preventDefault();
    confirm({ description: `Удалить ${name}?` })
      .then(() => deleteRequestWallet())
      .catch(() => {
        /* ... */
      });
  }

  const incomesData = useSelector(state => state.finance.transactionsDetail && state.finance.transactionsDetail.data)
  const classes = useStyles();
  return (
    <Dashboard>
      <div style={{ minHeight: "80vh", position: "relative" }} container justify="center">
        {loading &&
          <div>
            <Loader />
          </div>
        }
        {incomesData && (
          <Paper className={classes.mainCont}>
            <Typography variant="h4" className={classes.spaceBetween}>
              {incomesData.title}
              <div>
                <IconButton onClick={e => handleDeleteExpense(e, incomesData.title)} color="primary">
                  <DeleteIcon color="inherit" />
                </IconButton>

                <IconButton component={NavLink} to={`/transactions/update/${incomesDetailId}`} color="primary">
                  <EditIcon color="inherit" />
                </IconButton>
              </div>
            </Typography>
            <Typography className={`mb-3 ${classes.alignCenter}`} variant="h6">
              <MonetizationOnIcon className="mr-1" fontSize="medium" />
              {incomesData.amount+" KGS"}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PersonIcon className="mr-1" />
              Пользователь:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {incomesData.user}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PaymentIcon className="mr-1" />
              ID транзакции:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {incomesData.transaction_id}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <AccessTimeIcon className="mr-1" />
              Время:
            </Typography>
            <GetCreatedTime date={incomesData.created_date} />
            <Divider />

            <Box className={`mt-4  mb-4 `}>
              <Box className={`${classes.alignCenter}`}>
                <SettingsOverscanIcon className="mr-1" />
                <Typography variant="h6">
                  Фото или скан чека
                        </Typography>
              </Box>
              <Box className={"mb-3"} >
                <Typography variant="body-1">
                  {incomesData.confirmation && "Файл отсутствует!"}
                </Typography>
              </Box>
              <Box className={"col-lg-2 col-md-4 p-0 col-sm-12"}>
              <Button
                component={Link}
                href={incomesData.confirmation}
                variant="contained"
                color="primary"
                className={`${classes.alignCenter}`}
                target="_blank"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Скачать
              </Button>
              </Box>
            </Box>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <ChatIcon className="mr-1" />
              Комментарии:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {incomesData.comment}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <PaymentIcon className="mr-1" />
              Кошелек:
            </Typography>
            {/*<GetWalletDetail />*/}
            {incomesData.wallet}
          </Paper>
        )}
      </div>
    </Dashboard >
  )
}

export default IncomesDetail;
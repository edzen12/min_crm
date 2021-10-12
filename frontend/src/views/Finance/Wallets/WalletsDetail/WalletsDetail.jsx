import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import axios from "../../../../axios/configuratedAxios";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { fetchWalletDetailAction } from "../../../../redux/actions";
import Loader from "../../../../components/UI/Loader/Loader";
import { makeStyles } from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useConfirm } from "material-ui-confirm";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ChatIcon from '@material-ui/icons/Chat';
import {
  Paper,
  Typography,
  Divider,
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

function WalletsDetail(props) {
  const walletId = props.match.params.id;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchWalletDetailAction(walletId)).then(() => setLoading(false))
  }, []);

  const [loading, setLoading] = useState(true);

  async function deleteRequestWallet() {
    setLoading(true)
    try {
      await axios.delete(`/finances/wallets/${walletId}/`)
      setLoading(false);
      window.location = ('/wallets');
    } catch (error) {
      console.log(error)
    }
  }

  const confirm = useConfirm();
  function handleDeleteWallet(e, name) {
    e.preventDefault();
    confirm({ description: `Удалить ${name}?` })
      .then(() => deleteRequestWallet())
      .catch(() => {
        /* ... */
      });
  }

  const walletData = useSelector(state => state.finance.walletDetail.data);
  const classes = useStyles();

  return (
    <Dashboard>
      <div style={{ minHeight: "80vh", position: "relative" }} container justify="center">
        {loading &&
          <div>
            <Loader />
          </div>
        }
        {walletData && (
          <Paper className={classes.mainCont}>
            <Typography variant="h4" className={`mb-2 ${classes.spaceBetween}`}>
              {walletData.name}
              <div>
                <IconButton onClick={e => handleDeleteWallet(e, walletData.name)} color="primary">
                  <DeleteIcon color="inherit" />
                </IconButton>

                <IconButton component={NavLink} to={`/wallets/update/${walletId}`} color="primary">
                  <EditIcon color="inherit" />
                </IconButton>
              </div>
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <MonetizationOnIcon className="mr-1" fontSize="medium" />
                Баланс:
              </Typography>
            <Typography className={`mb-3 ${classes.alignCenter}`} variant="h6">
              {`${walletData.balance ? walletData.balance : "0"} KGS`}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <VpnKeyIcon className="mr-1" />
              ID кошелька:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {walletData.wallet_id ? walletData.wallet_id : "ID кошелька отсутствует"}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <FeaturedPlayListIcon className="mr-1" />
              Описание:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {walletData.description ? walletData.description : "Описание отсутствует"}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <ChatIcon className="mr-1" />
              Номер аккаунта:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {walletData.account_number ? walletData.account_number : "Номер аккаунта отсутствует"}
            </Typography>
            <Divider />

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`} >
              <VisibilityIcon className="mr-1" />
                Приватность:
              </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {walletData.privacy ===  "PRIVATE" ? "Приватный" : "Публичный"}
            </Typography>
            <Divider />
          </Paper>
        )}
      </div>
    </Dashboard >
  )
}

export default WalletsDetail;
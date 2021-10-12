import React, {useState, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import axios from "../../../axios/configuratedAxios";
import {useSelector, useDispatch} from "react-redux";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import {makeStyles} from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PaymentIcon from '@material-ui/icons/Payment';
import PersonIcon from '@material-ui/icons/Person';
import {useConfirm} from "material-ui-confirm";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {useToasts} from 'react-toast-notifications';
import ChatIcon from '@material-ui/icons/Chat';
import {
  Paper,
  Typography,
  Divider,
  IconButton
} from "@material-ui/core";
import {fetchInventories, setBreadcrumbs} from "../../../redux/actions";

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

function InventoryDetail(props) {

  const [loading, setLoading] = useState(false);

  const inventory = useSelector(state => state.inventories.inventories && state.inventories.inventories.data);
  const {addToast} = useToasts();

  const inventoryId = props.match.params.id;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchInventories(`inventories/${inventoryId}`))
    setLoading(false);
  }, [dispatch, inventoryId]);
  useEffect(() => {
    inventory && dispatch(setBreadcrumbs(
      [
        {title: "Инвентарь", to: "/inventories"},
        {title: inventory.title, to: ""},
      ]
    ))
  }, [inventory]);

  async function deleteInventory() {
    setLoading(true)
    try {
      await axios.delete(`inventories/${inventoryId}/`)
      setLoading(false);
      window.location = "/inventories/"
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const confirm = useConfirm();

  function handleDeleteInventory(e, name) {
    e.preventDefault();
    confirm({description: `Удалить ${name}?`})
      .then(() => deleteInventory())
      .catch(() => {
        /* ... */
      });
  }

  const classes = useStyles();

  return (
    <Dashboard>
      <div style={{minHeight: "80vh", position: "relative"}} container justify="center">
        {loading &&
        <div>
          <Loader/>
        </div>
        }
        {inventory && (
          <Paper className={classes.mainCont}>
            <Typography variant="h4" className={classes.spaceBetween}>
              {inventory.title}
              <div style={{justifySelf: "flex-end"}}>
                <IconButton onClick={e => handleDeleteInventory(e, inventory.title)} color="primary">
                  <DeleteIcon color="inherit"/>
                </IconButton>

                <IconButton component={NavLink} to={`/inventories/update/${inventoryId}`} color="primary">
                  <EditIcon color="inherit"/>
                </IconButton>
              </div>
            </Typography>
            <Typography className={`mb-3 ${classes.alignCenter}`} variant="h6">
              <MonetizationOnIcon className="mr-1" fontSize="medium"/>
              {`${inventory.total_price} KGS`}
            </Typography>
            <Divider/>

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`}>
              <PersonIcon className="mr-1"/>
              Филиал:
            </Typography>
            <Typography variant="body1" component={NavLink} to={`branches/${inventory.branch}`}
                        className={`ml-1 mt-2  ${classes.alignCenter}`}>
              {inventory.branch_name}
            </Typography>
            <Divider/>

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`}>
              <PaymentIcon className="mr-1"/>
              Номер идентификации:
            </Typography>
            <Typography variant="body1" className={`ml-1 mt-2  ${classes.alignCenter}`}>
              {inventory.inventory_number}
            </Typography>
            <Divider/>

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`}>
              <AccessTimeIcon className="mr-1"/>
              Количество:
            </Typography>
            <Typography variant="body1" className={`ml-1 mt-2  ${classes.alignCenter}`}>
              {inventory.amount}
            </Typography>
            <Divider/>

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`}>
              <PersonIcon className="mr-1"/>
              Цена за 1шт:
            </Typography>
            <Typography variant="body1" className={`ml-1 mt-2  ${classes.alignCenter}`}>
              {inventory.price}
            </Typography>
            <Divider/>

            <Typography variant="h6" className={`mt-4  ${classes.alignCenter}`}>
              <ChatIcon className="mr-1"/>
              Комментарии:
            </Typography>
            <Typography variant="body1" className={`ml-1 mb-4  ${classes.alignCenter}`}>
              {
                inventory.comment ?
                  inventory.comment :
                  "Коментарии нет"
              }
            </Typography>
            <Divider/>
          </Paper>
        )}
      </div>
    </Dashboard>
  )
}

export default InventoryDetail;
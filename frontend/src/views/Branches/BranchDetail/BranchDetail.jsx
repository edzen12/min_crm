import React, {useEffect, useState} from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import style from "./branchesDetail.module.css";
import {NavLink} from "react-router-dom";
import {useConfirm} from "material-ui-confirm";
import {useToasts} from 'react-toast-notifications';
import {
  Box,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import PolicyIcon from "@material-ui/icons/Policy";
import LocationCityIcon from '@material-ui/icons/LocationCity';
import HomeIcon from '@material-ui/icons/Home';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import "fontsource-roboto";
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch} from "react-redux";

function BranchDetail(props) {
  const {addToast} = useToasts();
  const [errorDialog, setErrorDialog] = useState(false)

  let branchId = props.match.params.id;

  const [loading, setLoading] = useState(false);
  const [branchDetailData, setBranchDetailData] = useState(null);
  const dispatch = useDispatch();

  async function fetchBranchDetail() {
    setLoading(true);
    try {
      const response = await axios.get(`/branches/${branchId}`);
      setLoading(false);
      setBranchDetailData(response.data);
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
    fetchBranchDetail();
  }, []);

  useEffect(() => {
    branchDetailData && dispatch(setBreadcrumbs(
      [
        {title: "Филиалы", to: "/branches"},
        {title: branchDetailData.name, to: ""},
      ]
    ))
  }, [branchDetailData]);

  async function deleteRequestBranch() {
    setLoading(true);
    try {
      await axios.delete(`/branches/${branchId}/`);
      setLoading(false);
      props.history.push("/branches");
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
  const handleDeleteBranch = (e) => {
    e.preventDefault();
    confirm({
      description: `Удалить ${branchDetailData.name}?`,
    })
      .then(() => deleteRequestBranch())
      .catch(() => {
        /* ... */
      });
  };

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

        {branchDetailData && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                <h2 style={{height: "100px", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", marginTop: "20px"}}>
                  Филиал - {branchDetailData.name}
                </h2>
                <div className={style.gridCont}>
                  <div>
                    <div classname={style.gridCell}>
                      <div className={style.courseActionBtns}>
                        <IconButton
                          onClick={(e) => handleDeleteBranch(e)}
                          color="primary"
                        >
                          <DeleteIcon color="inherit"/>
                        </IconButton>

                        <IconButton
                          component={NavLink}
                          to={{
                            pathname: `/branches/update/${branchDetailData.id}`,
                            id: branchDetailData.id,
                          }}
                          color="primary"
                        >
                          <EditIcon color="inherit"/>
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Email
                      </Typography>

                      <Typography variant="body1">
                        {branchDetailData.email}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Ном. тел.
                      </Typography>

                      {branchDetailData.telephone_number ? (
                        <Typography variant="body1">
                          {branchDetailData.telephone_number}
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
                      branchDetailData.class9 ? (
                        <Typography className="mt-1 mb-1" variant="body1">
                          9 - класс
                        </Typography>
                      ) : ''
                    }
                    {
                      branchDetailData.class10 ? (
                        <Typography className="mt-1 mb-1" variant="body1">
                          10 - класс
                        </Typography>
                      ) : ''
                    }
                    {
                      branchDetailData.class11 ? (
                        <Typography className="mt-1 mb-1" variant="body1">
                          11 - класс
                        </Typography>
                      ) : ''
                    }
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
                        <PolicyIcon/>
                        <Typography variant="body1">
                          &nbsp; Область
                        </Typography>
                      </Box>
                    </div>

                    {branchDetailData.oblast ? (
                      <Typography variant="body1">
                        {
                          branchDetailData.oblast === "IK"
                            ? "Ыссык-Кульская"
                            : branchDetailData.oblast === "CH"
                            ? "Чуйская"
                            : branchDetailData.oblast === "NR"
                              ? "Нарынская"
                              : branchDetailData.oblast === "TS"
                                ? "Таласская"
                                : branchDetailData.oblast === "JL"
                                  ? "Джалал-Абадская"
                                  : branchDetailData.oblast === "BT"
                                    ? "Баткенская"
                                    : "Ошская"
                        }
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
                        <LocationCityIcon/>
                        <Typography variant="body1">
                          &nbsp; Город
                        </Typography>
                      </Box>
                    </div>

                    {branchDetailData.city ? (
                      <Typography variant="body1">
                        {branchDetailData.city}
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
                        <HomeIcon/>
                        <Typography variant="body1">
                          &nbsp; Адрес
                        </Typography>
                      </Box>
                    </div>

                    {branchDetailData.address ? (
                      <Typography variant="body1">
                        {branchDetailData.address}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    )}

                  </div>
                  <div classname={style.gridCell}>
                    <div style={{padding: "10px 0 10px 15px"}} className={style.gridCell}>
                      <Typography variant="body1" gutterBottom>
                        <WbIncandescentIcon/>
                        &nbsp; Описание
                      </Typography>

                      <Typography variant="body1">
                        {branchDetailData.description}
                      </Typography>
                    </div>
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

export default BranchDetail;

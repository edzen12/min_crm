import React, { useEffect, useState } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import style from "./admin.module.css";
import { NavLink } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { useToasts } from 'react-toast-notifications';
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
import DescriptionIcon from '@material-ui/icons/Description';
import unknownUser from "../../../images/unknownUsers.png";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import TodayIcon from "@material-ui/icons/Today";
import EventIcon from "@material-ui/icons/Event";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TelegramIcon from "@material-ui/icons/Telegram";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch} from "react-redux";

function AdminDetail(props) {
  const { addToast } = useToasts();
  const [errorDialog, setErrorDialog] = useState(false)

  let adminId = props.match.params.id;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [adminDetailData, setadminDetailData] = useState(null);

  async function fetchAdminListDetail() {
    try {
      const response = await axios.get(`/users/administrators/${adminId}`);
      setLoading(false);
      setadminDetailData(response.data);
    } catch (error) {
      setLoading(false);
      setErrorDialog(true)
      addToast("??????-???? ?????????? ???? ??????!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    setLoading(true);
    adminId && fetchAdminListDetail();
  }, [adminId]);

  useEffect(() => {
    adminDetailData && dispatch(setBreadcrumbs(
      [
        {title: "????????????????????????????", to: "/adminsList"},
        {title: adminDetailData.user.email, to: ""},
      ]
    ))
  }, [adminDetailData]);

  async function deleteRequestAdmin() {
    setLoading(true);
    try {
      await axios.delete(`/users/${adminDetailData.user.id}/`);
      setLoading(false);
      props.history.push("/adminsList");
    } catch (error) {
      setLoading(false);
      setErrorDialog(true)
      addToast("??????-???? ?????????? ???? ??????!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const confirm = useConfirm();
  const handleDeleteAdmin = (e) => {
    e.preventDefault();
    confirm({
      description: `?????????????? ${adminDetailData.user.first_name} ${adminDetailData.user.last_name}?`,
    })
      .then(() => deleteRequestAdmin())
      .catch(() => {
        /* ... */
      });
  };

  return (
    <>
      <Dashboard>
        {loading && (
          <Loader />
        )}
        <Dialog
          open={errorDialog}
          onClose={() => setErrorDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <h6 style={{ color: "#dc004e" }}>????????????!</h6>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {adminDetailData && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                <img
                  className={style.img}
                  style={{display: 'block', 'margin': '0 auto'}}
                  src={
                    adminDetailData.user.avatar ? adminDetailData.user.avatar : unknownUser
                  }
                  alt="admin-profile-img"
                />
                <div className={style.gridCont}>
                  <div>
                    <div classname={style.gridCell}>
                      <div className={style.courseActionBtns}>
                        <IconButton
                          onClick={(e) => handleDeleteAdmin(e)}
                          color="primary"
                        >
                          <DeleteIcon color="inherit" />
                        </IconButton>

                        <IconButton
                          component={NavLink}
                          to={{
                            pathname: `/adminUpdate/${adminDetailData.id}`,
                            id: adminDetailData.id,
                          }}
                          color="primary"
                        >
                          <EditIcon color="inherit" />
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        ??????
                      </Typography>

                      <Typography variant="body1">
                        {`${adminDetailData.user.first_name} ${adminDetailData.user.last_name}`}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        ???????? ????????????????
                      </Typography>

                      {adminDetailData.user.birth_date ? (
                        <Typography variant="body1">
                          {adminDetailData.user.birth_date}
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Email
                      </Typography>

                      <Typography variant="body1">
                        {adminDetailData.user.email}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        ??????
                      </Typography>

                      <Typography variant="body1">
                        {adminDetailData.user.gender === "M" && "??????????????"}
                        {adminDetailData.user.gender === "F" && "??????????????"}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        ??????. ??????.
                      </Typography>

                      {adminDetailData.user.phone_number ? (
                        <Typography variant="body1">
                          {adminDetailData.user.phone_number}
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        ?????????????????? ??????.
                      </Typography>

                      {adminDetailData.user.second_phone_number ? (
                        <Typography variant="body1">
                          {adminDetailData.user.second_phone_number}
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">Instagram &nbsp;</Typography>
                        <InstagramIcon />
                      </Box>

                      {adminDetailData.user.instagram ? (
                        <Typography variant="body1">
                          <Link href={adminDetailData.user.instagram}>
                            ???????????? ???? ??????????????????...
                          </Link>
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">Facebook &nbsp;</Typography>
                        <FacebookIcon />
                      </Box>

                      {adminDetailData.user.facebook ? (
                        <Typography variant="body1">
                          <Link href={adminDetailData.user.facebook}>
                            ???????????? ???? ??????????????...
                          </Link>
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">Linkedin &nbsp;</Typography>
                        <LinkedInIcon />
                      </Box>

                      {adminDetailData.user.linkedin ? (
                        <Typography variant="body1">
                          <Link href={adminDetailData.user.linkedin}>
                            ???????????? ???? ????????????????...
                          </Link>
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">Telegram &nbsp;</Typography>
                        <TelegramIcon />
                      </Box>

                      {adminDetailData.user.telegram ? (
                        <Typography variant="body1">
                          <Link href={adminDetailData.user.telegram}>
                            ???????????? ???? ????????????????...
                          </Link>
                        </Typography>
                      ) : (
                          <Typography variant="body1" color="textSecondary">
                            ???? ??????????????
                          </Typography>
                        )}
                    </div>
                  </div>
                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      ????????????
                    </Typography>

                    {adminDetailData.user.branch ? (
                      <Typography component={NavLink} to={`/branches/${adminDetailData.user.branch}`} variant="body1">{adminDetailData.branch_name}</Typography>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        ???? ??????????????
                      </Typography>
                    )}
                  </div>
                </div>
              </Box>
            </Paper>

            <Paper className={style.secondPart}>
              <div className={style.secondPart_mainCont}>
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

                    {adminDetailData.authority ? (
                      <Typography variant="body1">
                        {adminDetailData.authority}
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

                    {adminDetailData.date_of_issue ? (
                      <Typography variant="body1">
                        {adminDetailData.date_of_issue}
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
                        <EventIcon />
                        <Typography variant="body1">
                          &nbsp; ???????? ????????????????
                        </Typography>
                      </Box>
                    </div>

                    {adminDetailData.date_of_expire ? (
                      <Typography variant="body1">
                        {adminDetailData.date_of_expire}
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
                        <AccountBoxIcon />
                        <Typography variant="body1">
                          &nbsp; ?????????? ????????????????
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="body1">
                      {adminDetailData.passport_number}
                    </Typography>
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

                    {adminDetailData.passport_scan ? (
                      <Button
                        component={Link}
                        href={adminDetailData.passport_scan}
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
                  <Typography variant="h6">??????????</Typography>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <DescriptionIcon />
                        <Typography variant="body1">&nbsp; ????????????????</Typography>
                      </Box>
                    </div>

                    {adminDetailData.contract ? (
                      <Button
                        component={Link}
                        href={adminDetailData.contract}
                        variant="contained"
                        color="primary"
                        target="_blank"
                        className={style.secondPart_btn}
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

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <ImportContactsIcon />
                        <Typography variant="body1">&nbsp; ????????????</Typography>
                      </Box>
                    </div>

                    {adminDetailData.cv ? (
                      <Button
                        component={Link}
                        href={adminDetailData.cv}
                        variant="contained"
                        color="primary"
                        target="_blank"
                        className={style.secondPart_btn}
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
                  <h4 className={style.h4}>??????????????</h4>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <AttachMoneyIcon />
                        <Typography variant="body1">&nbsp; ????????????????</Typography>
                      </Box>
                    </div>

                    {adminDetailData.salary ? (
                      <Typography variant="body1">
                        {adminDetailData.salary}
                      </Typography>
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

export default AdminDetail;

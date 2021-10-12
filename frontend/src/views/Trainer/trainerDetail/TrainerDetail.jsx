import React, { useEffect, useState } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import style from "./trainerDetail.module.css";
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
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import TodayIcon from "@material-ui/icons/Today";
import EventIcon from "@material-ui/icons/Event";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DescriptionIcon from '@material-ui/icons/Description';

import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TelegramIcon from "@material-ui/icons/Telegram";
import GitHubIcon from "@material-ui/icons/GitHub";
import {useToasts} from "react-toast-notifications";
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";

function TrainerDetail(props) {
  const dispatch = useDispatch()
  let trainerId = props.match.params.id;
  const { addToast } = useToasts()

  const [loading, setLoading] = useState(false);
  const [trainerDetailData, setTrainerDetailData] = useState(null);
  const userData = useSelector((state) => state.personalData.userData.data);

  async function fetchTrainerListDetail() {
    try {
      const response = await axios.get(`/users/trainers/${trainerId}`);
      setLoading(false);
      setTrainerDetailData(response.data);
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    setLoading(true);
    trainerId && fetchTrainerListDetail();
  }, [trainerId]);

  useEffect(() => {
    trainerDetailData && dispatch(setBreadcrumbs(
      [
        {title: "Менторы", to: "/trainersList"},
        {title: trainerDetailData.user.email, to: ""},
      ]
    ))
  }, [trainerDetailData]);

  async function deleteRequestTrainer() {
    setLoading(true);
    try {
      await axios.delete(`/users/${trainerDetailData.user.id}/`);
      setLoading(false);
      props.history.push("/trainersList");
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }
  const confirm = useConfirm();
  const handleDeleteTrainer = (e) => {
    e.preventDefault();
    confirm({
      description: `Удалить ${trainerDetailData.user.first_name} ${trainerDetailData.user.last_name}?`,
    })
      .then(() => deleteRequestTrainer())
      .catch(() => {
        /* ... */
      });
  };

  return (
    <>
      <Dashboard>
        {loading && (
          <div style={{ minHeight: "80vh", position: "relative" }}>
            <Loader />
          </div>
        )}

        {trainerDetailData && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                <img
                  style={{display: 'block', margin: '0 auto'}}
                  className={style.img}
                  src={
                    trainerDetailData.user.avatar
                      ? trainerDetailData.user.avatar
                      : unknownUser
                  }
                  alt="trainer-profile-image"
                />
                <div className={style.gridCont}>
                  <div>
                    <div classname={style.gridCell}>
                      <div className={style.courseActionBtns}>
                      {userData && userData.is_administrator ? (
                        <IconButton
                        onClick={(e) => handleDeleteTrainer(e)}
                        color="primary"
                      >
                        <DeleteIcon color="inherit" />
                      </IconButton>
                      ) : null}
                        

                        <IconButton
                          component={NavLink}
                          to={{
                            pathname: `/trainer/update/${trainerDetailData.id}`,
                            email: trainerDetailData.id,
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
                        ФИО
                      </Typography>

                      <Typography variant="body1">
                        {`${trainerDetailData.user.first_name} ${trainerDetailData.user.last_name}`}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Дата рождения
                      </Typography>

                      {trainerDetailData.user.birth_date ? (
                        <Typography variant="body1">
                          {trainerDetailData.user.birth_date}
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
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
                        {trainerDetailData.user.email}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Пол
                      </Typography>

                      <Typography variant="body1">
                        {trainerDetailData.user.gender === "M" && "Мужчина"}
                        {trainerDetailData.user.gender === "F" && "Женщина"}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Ном. тел.
                      </Typography>

                      {trainerDetailData.user.phone_number ? (
                        <Typography variant="body1">
                          {trainerDetailData.user.phone_number}
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
                        </Typography>
                      )}
                    </div>
                  </div>

                    <div classname={style.gridCell}>
                      <div className={style.gridCell}>
                        <Typography variant="h6" gutterBottom>
                          Резервный тел.
                        </Typography>

                        {trainerDetailData.user.second_phone_number ? (
                        <Typography variant="body1">
                          {trainerDetailData.user.second_phone_number}
                        </Typography>
                        ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
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

                        {trainerDetailData.user.instagram ? (
                          <Typography variant="body1">
                          <Link
                            href={trainerDetailData.user.instagram}
                            target="_blank"
                          >
                            Ссылка на инстаграм...
                          </Link>
                        </Typography>
                        ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
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

                        {trainerDetailData.user.facebook ? (
                          <Typography variant="body1">
                          <Link
                            href={trainerDetailData.user.facebook}
                            target="_blank"
                          >
                            Ссылка на фейсбук...
                          </Link>
                        </Typography>
                        ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
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

                        {trainerDetailData.user.linkedin ? (
                          <Typography variant="body1">
                          <Link
                            href={trainerDetailData.user.linkedin}
                            target="_blank"
                          >
                            Ссылка на линкедин...
                          </Link>
                          </Typography>
                        ) : (
                        <Typography variant="body1" color="textSecondary">
                          Не указано
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

                        {trainerDetailData.user.telegram ? (
                          <Typography variant="body1">
                          <Link
                            href={trainerDetailData.user.telegram}
                            target="_blank"
                          >
                            Ссылка на телеграм...
                          </Link>
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
                      Филиал
                    </Typography>

                    {trainerDetailData.user.branch ? (
                      <Typography component={NavLink} to={`/branches/${trainerDetailData.user.branch}`} variant="body1">{trainerDetailData.branch_name}</Typography>
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
                  <Typography variant="h6">Паспортные данные</Typography>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <PolicyIcon />
                        <Typography variant="body1">
                          &nbsp; Кем выдан
                        </Typography>
                      </Box>
                    </div>
                    
                    {trainerDetailData.authority ? (
                      <Typography variant="body1">
                        {trainerDetailData.authority}
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
                        <TodayIcon />
                        <Typography variant="body1">
                          &nbsp; Дата выдачи
                        </Typography>
                      </Box>
                    </div>
                    
                    {trainerDetailData.date_of_issue ? (
                      <Typography variant="body1">
                        {trainerDetailData.date_of_issue}
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
                        <EventIcon />
                        <Typography variant="body1">
                          &nbsp; Срок действия
                        </Typography>
                      </Box>
                    </div>

                    {trainerDetailData.date_of_expire ? (
                      <Typography variant="body1">
                        {trainerDetailData.date_of_expire}
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
                        <AccountBoxIcon />
                        <Typography variant="body1">
                          &nbsp; Номер паспорта
                        </Typography>
                      </Box>
                    </div>

                    {trainerDetailData.passport_number ? (
                      <Typography variant="body1">
                        {trainerDetailData.passport_number}
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
                        <SettingsOverscanIcon />
                        <Typography variant="body1">
                          &nbsp; Скан паспорта
                        </Typography>
                      </Box>
                    </div>

                    {trainerDetailData.passport_scan ? (
                        <Button
                        component={Link}
                        href={trainerDetailData.passport_scan}
                        variant="contained"
                        color="primary"
                        className={style.secondPart_btn}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                        >
                          Скачать
                        </Button>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не прикреплен
                      </Typography>
                    )}
                  </div>
                </div>

                <div className={style.secontPart_cont}>
                  <Typography variant="h6">Файлы</Typography>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <DescriptionIcon />
                        <Typography variant="body1">&nbsp; Контракт</Typography>
                      </Box>
                    </div>
                    
                    {trainerDetailData.contract ? (
                        <Button
                        component={Link}
                        href={trainerDetailData.contract}
                        variant="contained"
                        color="primary"
                        target="_blank"
                        className={style.secondPart_btn}
                        style={{ textDecoration: "none" }}
                      >
                        Скачать
                      </Button>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не прикреплен
                      </Typography>
                    )}
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <ImportContactsIcon />
                        <Typography variant="body1">&nbsp; Резюме</Typography>
                      </Box>
                    </div>

                    {trainerDetailData.cv ? (
                        <Button
                        component={Link}
                        href={trainerDetailData.cv}
                        variant="contained"
                        color="primary"
                        target="_blank"
                        className={style.secondPart_btn}
                        style={{ textDecoration: "none" }}
                      >
                        Скачать
                      </Button>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не прикреплен
                      </Typography>
                    )}
                  </div>
                </div>

                <div className={style.secontPart_cont}>
                  <Typography variant="h6">Финансы</Typography>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <AttachMoneyIcon />
                        <Typography variant="body1">&nbsp; Зарплата</Typography>
                      </Box>
                    </div>
                    
                    {trainerDetailData.salary ? (
                      <Typography variant="body2">
                        {trainerDetailData.salary}
                      </Typography>
                      ) : (
                      <Typography variant="body1" color="textSecondary">
                        Не указано
                      </Typography>
                    )}
                  </div>
                </div>

                <div className={style.secontPart_cont}>
                  <Typography variant="h6">Дополнительные данные</Typography>

                    <div classname={style.gridCell}>
                      <div className={style.gridCell}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6">Github &nbsp;</Typography>
                          <GitHubIcon />
                        </Box>

                        {trainerDetailData.github ? (
                          <Typography variant="body1">
                            <Link href={trainerDetailData.github} target="_blank">
                              Ссылка на гитхаб...
                            </Link>
                          </Typography>
                          ) : (
                          <Typography variant="body1" color="textSecondary">
                            Не указано
                          </Typography>
                        )}
                      </div>
                    </div>

                  {trainerDetailData.is_assistant && (
                    <div classname={style.gridCell}>
                      <div className={style.gridCell}>
                        <Typography variant="h6" gutterBottom>
                          Должность
                        </Typography>

                        <Typography variant="body1">
                          Ассистент
                        </Typography>
                      </div>
                    </div>
                  )}

                  {trainerDetailData.is_trainer && (
                    <div classname={style.gridCell}>
                      <div className={style.gridCell}>
                        <Typography variant="h6" gutterBottom>
                          Должность
                        </Typography>

                        <Typography variant="body1">
                          Тренер
                        </Typography>
                      </div>
                    </div>
                  )}
                  
                  {(trainerDetailData.fired === false || trainerDetailData.fired === true) && (
                    <div classname={style.gridCell}>
                      <div className={style.gridCell}>
                        <Typography variant="h6" gutterBottom>
                          Работает?
                        </Typography>

                        <Typography variant="body1">
                        {trainerDetailData.fired ? 'Нет' : 'Да'}
                        </Typography>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </Paper>
          </Box>
        )}
      </Dashboard>
    </>
  );
}

export default TrainerDetail;

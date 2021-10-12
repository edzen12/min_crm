import React, {useEffect, useState} from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import Loader from "../../../components/UI/Loader/Loader";
import style from './staffMemberDetail.module.css';
import {NavLink} from 'react-router-dom'
import {useConfirm} from "material-ui-confirm";
import {
  Box,
  Button,
  Paper,
  IconButton,
  Link,
  Typography
} from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import PolicyIcon from '@material-ui/icons/Policy';
import GavelIcon from '@material-ui/icons/Gavel';
import unknownUser from "../../../images/unknownUsers.png";
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TelegramIcon from '@material-ui/icons/Telegram';
import {useToasts} from 'react-toast-notifications';
import {useDispatch} from "react-redux";
import {setBreadcrumbs} from "../../../redux/actions";

function StaffMemberDetail(props) {
  const {addToast} = useToasts()

  let staffId = props.match.params.id
  const [loading, setLoading] = useState(false);
  const [staffDetailData, setStaffDetailData] = useState(null);
  const dispatch = useDispatch();

  async function fetchStaffMemberDetail() {
    try {
      const response = await axios.get(`/users/staff-members/${staffId}`)
      setLoading(false);
      setStaffDetailData(response.data);
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }
  useEffect(() => {
    setLoading(true)
    fetchStaffMemberDetail()
  }, [staffId]);

  useEffect(() => {
    staffDetailData && dispatch(setBreadcrumbs(
      [
        {title: "Сотрудники", to: "/staffMembersList"},
        {title: staffDetailData.user.email, to: ""},
      ]
    ))
  }, [staffDetailData]);

  async function deleteRequestStaff() {
    setLoading(true)
    try {
      await axios.delete(`/users/${staffDetailData.user.id}/`)
      setLoading(false);
      props.history.push('/staffMembersList');
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const confirm = useConfirm();
  const handleDeleteStaff = (e) => {
    e.preventDefault();
    confirm({description: `Удалить ${staffDetailData.user.first_name} ${staffDetailData.user.last_name}?`})
      .then(() => deleteRequestStaff())
      .catch(() => {
      });
  };

  return (
    <>
      <Dashboard>
        {loading &&
        <Loader/>
        }

        {staffDetailData && (
          <Box className={style.mainCont}>
            <Paper className={style.partFirst}>
              <Box className={style.imgCont}>
                <img 
                  className={style.img} 
                  src={staffDetailData.user.avatar ? staffDetailData.user.avatar : unknownUser}
                  alt="staff-profile-img"
                  style={{display: 'block', margin: '0 auto'}}
                  />
                <div className={style.gridCont}>
                  <div>
                    <div classname={style.gridCell}>
                      <div className={style.courseActionBtns}>
                        <IconButton onClick={e => handleDeleteStaff(e)} color="primary">
                          <DeleteIcon color="inherit"/>
                        </IconButton>

                        <IconButton component={NavLink} to={{
                          pathname: `/staffMember/update/${staffDetailData.id}`,
                          email: staffDetailData.id
                        }} color="primary">
                          <EditIcon color="inherit"/>
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
                        {`${staffDetailData.user.first_name} ${staffDetailData.user.last_name}`}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Дата рождения
                      </Typography>

                      <Typography variant="body1">
                        {staffDetailData.user.birth_date}
                      </Typography>

                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Email
                      </Typography>

                      <Typography variant="body1">
                        {staffDetailData.user.email}
                      </Typography>

                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Пол
                      </Typography>

                      <Typography variant="body1">
                        {staffDetailData.user.gender === "M" && "Мужчина"}
                        {staffDetailData.user.gender === "F" && "Женщина"}
                      </Typography>
                    </div>
                  </div>

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Ном. тел.
                      </Typography>

                      <Typography variant="body1">
                        {staffDetailData.user.phone_number}
                      </Typography>
                    </div>
                  </div>

                  {staffDetailData.user.second_phone_number &&

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>
                      <Typography variant="h6" gutterBottom>
                        Резервный тел.
                      </Typography>

                      <Typography variant="body1">
                        {staffDetailData.user.phone_number}
                      </Typography>
                    </div>
                  </div>
                  }

                  {staffDetailData.user.instagram &&
                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>

                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">
                          Instagram &nbsp;
                        </Typography>
                        <InstagramIcon/>
                      </Box>

                      <Typography variant="body1">
                        <Link href={staffDetailData.user.instagram}>
                          Ссылка на инстаграм...
                        </Link>
                      </Typography>

                    </div>
                  </div>
                  }

                  {staffDetailData.user.facebook &&
                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>

                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">
                          Facebook &nbsp;
                        </Typography>
                        <FacebookIcon/>
                      </Box>

                      <Typography variant="body1">
                        <Link href={staffDetailData.user.facebook}>
                          Ссылка на фейсбук...
                        </Link>
                      </Typography>
                    </div>
                  </div>
                  }

                  {staffDetailData.user.linkedin &&
                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>

                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">
                          Linkedin &nbsp;
                        </Typography>
                        <LinkedInIcon/>
                      </Box>

                      <Typography variant="body1">
                        <Link href={staffDetailData.user.linkedin}>
                          Ссылка на линкедин...
                        </Link>
                      </Typography>
                    </div>
                  </div>
                  }

                  {staffDetailData.user.telegram &&

                  <div classname={style.gridCell}>
                    <div className={style.gridCell}>

                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">
                          Telegram &nbsp;
                        </Typography>
                        <TelegramIcon/>
                      </Box>

                      <Typography variant="body1">
                        <Link href={staffDetailData.user.telegram}>
                          Ссылка на телеграм...
                        </Link>
                      </Typography>
                    </div>
                  </div>
                  }
                  <div className={style.gridCell}>
                    <Typography variant="h6" gutterBottom>
                      Филиал
                    </Typography>

                    {staffDetailData.user.branch ? (
                      <Typography component={NavLink} to={`/branches/${staffDetailData.user.branch}`} variant="body1">{staffDetailData.branch_name}</Typography>
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

                  <Typography variant="h6">
                    Паспортные данные
                  </Typography>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <PolicyIcon/>
                        <Typography variant="body1">
                          &nbsp; Кем выдан
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.authority}
                    </Typography>
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <TodayIcon/>
                        <Typography variant="body1">
                          &nbsp; Дата выдачи
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.date_of_issue}
                    </Typography>
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <EventIcon/>
                        <Typography variant="body1">
                          &nbsp; Срок действия
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.date_of_expire}
                    </Typography>
                  </div>


                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <AccountBoxIcon/>
                        <Typography variant="body1">
                          &nbsp; Номер паспорта
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.passport_number}
                    </Typography>
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <SettingsOverscanIcon/>
                        <Typography variant="body1">
                          &nbsp; Скан паспорта
                        </Typography>
                      </Box>

                    </div>
                    {staffDetailData.passport_scan ? (
                      <Button
                        component={Link}
                        href={staffDetailData.passport_scan}
                        variant="contained"
                        color="primary"
                        className={style.secondPart_btn}
                        target="_blank"
                        style={{textDecoration: "none"}}
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

                  <Typography variant="h6">
                    Файлы
                  </Typography>


                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <GavelIcon/>
                        <Typography variant="body1">
                          &nbsp; Договор
                        </Typography>
                      </Box>
                    </div>
                    {staffDetailData.contract ? (
                      <Button
                        component={Link}
                        href={staffDetailData.contract}
                        variant="contained"
                        color="primary"
                        target="_blank"
                        className={style.secondPart_btn}
                        style={{textDecoration: "none"}}
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
                        <ImportContactsIcon/>
                        <Typography variant="body1">
                          &nbsp; Резюме
                        </Typography>
                      </Box>
                    </div>
                    {staffDetailData.cv ? (
                      <Button
                        component={Link}
                        href={staffDetailData.cv}
                        variant="contained"
                        color="primary"
                        target="_blank"
                        className={style.secondPart_btn}
                        style={{textDecoration: "none"}}
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
                  <h4 className={style.h4}>Финансы</h4>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <AttachMoneyIcon/>
                        <Typography variant="body1">
                          &nbsp; Зарплата
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.salary}
                    </Typography>
                  </div>
                </div>

                <div className={style.secontPart_cont}>
                  <h4 className={style.h4}>Обязонности</h4>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <GroupAddIcon/>
                        <Typography variant="body1">
                          &nbsp; HR 
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.is_hr ? 'Задействован(а)' : 'Не задействован(а)'}
                    </Typography>
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <MonetizationOnIcon/>
                        <Typography variant="body1">
                          &nbsp; Менеджер по продажам 
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.is_sales ? 'Задействован(а)' : 'Не задействован(а)'}
                    </Typography>
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <ThumbUpAltIcon/>
                        <Typography variant="body1">
                          &nbsp; Маркетолог
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.is_marketing ? 'Задействован(а)' : 'Не задействован(а)'}
                    </Typography>
                  </div>

                  <div className={style.secondPart_cell}>
                    <div className={style.secondPart_miniCont}>
                      <Box display="flex" alignItems="center">
                        <MonetizationOnIcon/>
                        <Typography variant="body1">
                          &nbsp; Менеджер по финансам
                        </Typography>
                      </Box>
                    </div>
                    <Typography variant="p">
                      {staffDetailData.is_finance ? 'Задействован(а)' : 'Не задействован(а)'}
                    </Typography>
                  </div>

                </div>
              </div>
            </Paper>
          </Box>
        )}
      </Dashboard>
    </>
  )
};

export default StaffMemberDetail;
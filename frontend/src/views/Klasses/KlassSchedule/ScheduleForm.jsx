import React, { useState, useEffect, useRef } from "react";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import {
  Link,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LinkIcon from '@material-ui/icons/Link';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import Close from "@material-ui/icons/Close";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import CalendarToday from "@material-ui/icons/CalendarToday";
import CheckIcon from '@material-ui/icons/Check';
import Create from "@material-ui/icons/Create";
import MomentUtils from "@date-io/moment";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import * as Yup from "yup";
import { Formik } from "formik";
import FormikControl from "../../../components/FormikControl";
import axios from "../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ScheDuleForm = (props) => {
  const { addToast } = useToasts();
  const klassId = props.klassId;
  const [appointmentChanges, setAppoitmentChanges] = useState({});
  const [openAttendace, setOpenAttendace] = useState(false);
  const attendanceClasses = useStyles();

  const handleClickOpen = () => {
    setOpenAttendace(true);
  };

  const getAppointmentData = () => {
    const { appointmentData } = props;
    return appointmentData;
  };

  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    homework_link: false,
    endDate: false,
  });

  const initialValues = {
    new_material: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Это обязательное поле!"),
    material: Yup.string().required("Это обязательное поле!"),
    homework_link: Yup.string().required("Это обязательное поле!"),
  });

  const changeAppointment = ({ field, changes }) => {
    const nextChanges = {
      ...appointmentChanges,
      [field]: changes,
    };
    setAppoitmentChanges(nextChanges);
  };
      const {
        classes,
        visible,
        visibleChange,
        appointmentData,
        cancelAppointment,
        current_chedule_attendances,
        target,
        onHide,
        userData
      } = props;

      const displayAppointmentData = {
        ...appointmentData,
        ...appointmentChanges,
      };

      const [schedule_attendances, setSchedule_attendances] = useState([]);

      const commitAttandences = () => {
        const schedule_data = {
          ...getAppointmentData(),
          ...appointmentChanges,
        };
        
        const data = {
          schedule_attendances: schedule_attendances
        }

        axios.patch(`schedules/${schedule_data.id}/`, data)
          .then(response => {
          })
          .catch(e => {
            addToast("Что-то пошло не так!", {
              appearance: "error",
              autoDismiss: true
            })
          })
      }

      const commitAppointment = (type, values) => {

        let formData = new FormData();
        const { commitChanges } = props;
    
        const schedule_data = {
          ...getAppointmentData(),
          ...appointmentChanges,
        };
        
        if (!schedule_data.title ||
          !schedule_data.homework_link ||
          schedule_data.startDate.getDay() !== schedule_data.endDate.getDay()) {
          setFieldErrors({
            homework_link: !schedule_data.homework_link,
            title: !schedule_data.title,
            endDate: schedule_data.startDate.getDay() !== schedule_data.endDate.getDay()
          });
          return
        }
    
        if (type === "deleted") {
          commitChanges({ [type]: schedule_data.id });
    
        } else if (type === "changed") {
    
          schedule_data.title && formData.append('title', schedule_data.title);
          schedule_data.startDate && formData.append('day', formatDate(schedule_data.startDate));
          values.new_material && formData.append('material', values.new_material);
          schedule_data.startDate && formData.append('start_time', formatTime(schedule_data.startDate));
          schedule_data.endDate && formData.append('end_time', formatTime(schedule_data.endDate));
          schedule_data.homework_link && formData.append('homework_link', schedule_data.homework_link);
          formData.append('schedule_attendances', schedule_attendances);
    
          axios.patch(`schedules/${schedule_data.id}/`, formData)
            .then(response => {})
            .catch(e => {
              addToast("Что-то пошло не так!", {
                appearance: "error",
                autoDismiss: true
              })
            })
    
          commitChanges({ [type]: { [schedule_data.id]: schedule_data } });
    
        } else {
    
          schedule_data.title && formData.append('title', schedule_data.title);
          schedule_data.startDate && formData.append('day', formatDate(schedule_data.startDate));
          values.new_material && formData.append('material', values.new_material);
          schedule_data.startDate && formData.append('start_time', formatTime(schedule_data.startDate));
          schedule_data.endDate && formData.append('end_time', formatTime(schedule_data.endDate));
          schedule_data.homework_link && formData.append('homework_link', schedule_data.homework_link);
          formData.append('klass', +klassId);
    
          axios.post(`schedules/`, formData)
            .then(response => {
              window.location.reload();
            })
            .catch(e => {
              addToast("Что-то пошло не так!", {
                appearance: "error",
                autoDismiss: true
              })
              commitChanges({ [type]: schedule_data });
            })
          };
          visibleChange();
          setAppoitmentChanges({});
      }


      if(current_chedule_attendances && schedule_attendances.length==0){
        setSchedule_attendances(current_chedule_attendances);
        // console.log(current_chedule_attendances);
      }

      // console.log('current_chedule_attendances: ', current_chedule_attendances);
      // console.log('schedule_attendances: ', schedule_attendances);

      const isNewAppointment = appointmentData.id === undefined;

      const applyChanges = (values, visibleChange) => commitAppointment(isNewAppointment ? "added" : "changed", values, visibleChange);

      const textEditorProps = (field, label) => ({
        variant: "outlined",
        onChange: ({ target: change }) => {
          if(userData.is_student){
            return
          }
          changeAppointment({
            field: [field],
            changes: change.value,
          })
          if (field === 'title' || field === 'homework_link') {
            setFieldErrors({
              ...fieldErrors,
              [field]: !change.value
            });
          }
        },
        value: displayAppointmentData[field] || "",
        label: label,
        className: classes.textField,
      });

      const pickerEditorProps = (field) => ({
        className: classes.picker,
        // keyboard: true,
        ampm: false,
        value: displayAppointmentData[field],
        initialFocusedDate: new Date(),
        onChange: (date) => {

          setFieldErrors({
            ...fieldErrors,
            [field]: false
          });

          changeAppointment({
            field: [field],
            changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
          })
        },
        inputVariant: "outlined",
        format: "DD/MM/YYYY HH:mm",
        onError: () => null,
      });

      const formatDate = (date) => {
        var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2)
          month = '0' + month;
        if (day.length < 2)
          day = '0' + day;

        return [year, month, day].join('-');
      }

      const formatTime = (date) => {
        return [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
      }

      const cancelChanges = () => {
        setAppoitmentChanges({});
        visibleChange();
        cancelAppointment();
        setFieldErrors({ title: false, homework_link: false, endDate: false });
      };

      const customOnHide = () => {
        setFieldErrors({ title: false, homework_link: false, endDate: false });
        onHide();
      }

      const handleClose = () => {
        setOpenAttendace(false);
      };

      return (
        <AppointmentForm.Overlay visible={visible} target={target} onHide={customOnHide}>
          <Formik initialValues={initialValues} validationSchema={validationSchema} >
            {({ values }) => (
              <div>
                <div className={classes.header}>
                  <IconButton
                    className={classes.closeButton}
                    onClick={cancelChanges}
                  >
                    <Close color="action" />
                  </IconButton>
                </div>

                <div className={classes.content}>
                  <div className={classes.wrapper}>
                    <Create className={classes.icon} color="action" />
                    <TextField
                      {...textEditorProps("title", "Тема")}
                      required={true}
                      disabled={userData.is_student}
                      error={fieldErrors.title}
                      helperText={fieldErrors.title ? "Это поле является обязательным" : ""}
                    />
                  </div>

                  {
                    displayAppointmentData['material'] ? (<div className={classes.wrapper} style={{ justifyContent: "flex-start", alignItems: "center" }}>
                      <BookmarkIcon className={classes.icon} color="action" />

                      <Typography variant="body1">
                        <Link href={displayAppointmentData['material']} target="_blank" style={{ padding: "5px" }}>
                          Текущий материал...
                        </Link>
                      </Typography>
                    </div>) : null
                  }

                  {userData.is_student ? null : (
                  <div className={classes.wrapper}>
                    <ImportContactsIcon className={classes.icon} color="action" />

                    <FormikControl
                      control="file-upload"
                      name="new_material"
                      label="Загрузить материал темы"
                      variant="outlined"
                      fullwidth="true"
                    />
                  </div>
                  )}
                  

                  <div className={classes.wrapper}>
                    <CalendarToday className={classes.icon} color="action" />

                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDateTimePicker
                        label="Начало урока"
                        {...pickerEditorProps("startDate")}
                        disabled={userData.is_student}
                      />
                      <KeyboardDateTimePicker
                        label="Конец урока"
                        disabled={userData.is_student}
                        {...pickerEditorProps("endDate")}
                        error={fieldErrors.endDate}
                        helperText={fieldErrors.endDate ? "Урок должен быть в отрезке времени одного дня!" : ""}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div className={classes.wrapper}>
                    <LinkIcon className={classes.icon} color="action" />
                    <TextField
                      {...textEditorProps("homework_link", 'Ссылка на домашнее задание')}
                      required={true}
                      error={fieldErrors.homework_link}
                      helperText={fieldErrors.homework_link ? "Это поле является обязательным" : ""}
                    />
                  </div>

                  {!isNewAppointment && !userData.is_student ? (
                    <div className={classes.wrapper}>
                  <CheckIcon className={classes.icon} color="action" />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClickOpen}
                    >
                      Посещения
                    </Button>
                  </div>
                  ) : null}
                </div>

                <div>
                <Dialog
                  fullScreen
                  open={openAttendace}
                  onClose={handleClose}
                  TransitionComponent={Transition}
                >
                  <AppBar className={attendanceClasses.appBar}>
                    <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h6" className={attendanceClasses.title}>
                        Посещения урока {displayAppointmentData['title']}
                      </Typography>
                      <Button autoFocus color="inherit" onClick={() => {
                        // applyChanges(values, visibleChange)
                        commitAttandences();
                        handleClose();
                      }}>
                        Сохранить
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <List>
                    {schedule_attendances.map((schedule_attendance, index) => (
                        <ListItem button key={index}>
                          <ListItemText
                            primary={`${schedule_attendance.student.user.first_name} ${schedule_attendance.student.user.last_name}`}
                            secondary={schedule_attendance.status ? 'Был на уроке' : 'Не был'}
                          />
                          <Checkbox
                            onClick={() => {
                              setSchedule_attendances(schedule_attendances.map((schedule) =>
                                  schedule.id === schedule_attendance.id
                                    ? { ...schedule, status: !schedule.status }
                                    : schedule
                                ))
                            }}
                            checked={schedule_attendance.status}
                          />
                        </ListItem>
                    ))}
                  </List>
                  {/* <pre>{JSON.stringify(schedule_attendances, 0, 2)}</pre> */}
                </Dialog>
              </div>


              {/* ------------------------------------------------------- */}

                {/* <ScheduleAttendance
                  handleClose={handleClose}
                  open={openAttendace}
                  title={displayAppointmentData['title']}
                  klassId={props.klassId}
                  changeAppointment={changeAppointment}
                  getAppointmentData={getAppointmentData}
                /> */}

                {!userData.is_student ? (
                <div className={classes.buttonGroup}>
                  {!isNewAppointment && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.button}
                      onClick={() => {
                        visibleChange();
                        commitAppointment("deleted");
                      }}
                    >
                      Удалить
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    type="submit"
                    onClick={(e) => {
                      applyChanges(values, visibleChange);
                    }}
                  >
                    {isNewAppointment ? "Cоздать" : "Сохранить"}
                  </Button>
                </div>
                ) : null}
              </div>
            )}
          </Formik>
        </AppointmentForm.Overlay>
      );

    };

    export default ScheDuleForm;

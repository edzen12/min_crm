import React, { useState, useEffect } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import Loader from "../../../components/UI/Loader/Loader";
import { useToasts } from 'react-toast-notifications'
import FormikErrorFocus from 'formik-error-focus';
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches, setBreadcrumbs } from "../../../redux/actions";
import { stopLoading } from "../../../redux/actions/createUser";
import ImageDropzone from "../../../components/UI/ImageDropzone/ImageDropzone";
import style from '../StudentDetail/studentDetail.module.css';
import unknownUser from '../../../images/unknownUsers.png';
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";


function UpdateUser(props) {
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fetchBranches())
  }, [dispatch]);

  const { addToast } = useToasts();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedKlasses, setFetchedKlasses] = useState([]);
  const [fetchedCategories, setFetchedCategories] = useState([]);

  const studentId = props.match.params.id;
  const profileData = useSelector(state => state.personalData.profileData.data);

  useEffect(() => {
    initialValues && dispatch(setBreadcrumbs(
      [
        { title: "Студенты", to: "/studentsList" },
        { title: initialValues.user.email, to: "" },
      ]
    ))
  }, [initialValues]);

  const initialTouched = {
    user: {
      avatar: false
    }
  }

  const dispatchedBranches = useSelector(
    (state) =>
      state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches ? (dispatchedBranches.results || []).map(branch => ({
    id: branch.id,
    value: branch.id,
    label: branch.name
  })) : [];

  async function fetchStudentDetail() {
    try {
      const response = await axios.get(`/users/students/${studentId}/`)
      setInitialValues({...response.data, category: response.data.category.map(
        item => ({
          id: item.id,
          value: item.title,
          title: item.title
        })
      )});

    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    axios.get('klasses/')
      .then(response => {
        setFetchedKlasses(response.data.results.map(item => ({ value: item.id, label: item.klass_id })))
      })
      .catch(e => {
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      })

      axios.get('/users/students/student-categories/')
        .then(response => {
          setFetchedCategories(response.data.results.map(item => ({ id: item.id, value: item.title, title: item.title })))
        }).catch(e => {
          addToast("Что-то пошло не так!", {
            appearance: "error",
            autoDismiss: true
          })
        })

        fetchStudentDetail();
        
      }, []);
      
  const validationSchema = Yup.object({
  });

  const appendUserData = (values) => {
    const formData1 = new FormData();
    values.user.email && formData1.append("email", values.user.email);
    values.user.first_name && formData1.append("first_name	", values.user.first_name);
    typeof values.user.avatar === 'object' && values.user.avatar !== null && formData1.append("avatar", values.user.avatar, values.user.avatar.name);
    values.user.last_name && formData1.append("last_name	", values.user.last_name);
    values.user.phone_number && formData1.append("phone_number	", values.user.phone_number.split(' ').join(''));
    values.user.second_phone_number && formData1.append("second_phone_number	", values.user.second_phone_number.split(' ').join(''));
    values.user.birth_date && formData1.append("birth_date", formatDate(values.user.birth_date.toString()));
    values.user.gender && formData1.append("gender	", values.user.gender);
    values.user.instagram && formData1.append("instagram	", values.user.instagram);
    values.user.facebook && formData1.append("facebook	", values.user.facebook);
    values.user.linkedin && formData1.append("linkedin	", values.user.linkedin);
    values.user.telegram && formData1.append("telegram", values.user.telegram);
    values.user.branch && formData1.append("branch", values.user.branch);
    formData1.append('is_student', true);
    updateUserRequest(formData1);
  }

  const appendStudentData = (values, resetForm) => {

    const formData2 = new FormData();
    values.enrollment_date && formData2.append('enrollment_date', formatDate(values.enrollment_date));
    values.study_start_date && formData2.append('study_start_date', formatDate(values.study_start_date));
    values.finish_date && formData2.append('finish_date', formatDate(values.finish_date));

    values.status && formData2.append('status', values.status);
    values.address && formData2.append('address', values.address);
    values.residence_address && formData2.append('residence_address', values.residence_address);
    values.residence && formData2.append('residence', values.residence);
    values.mother_name && formData2.append('mother_name', values.mother_name);
    values.mother_phone_number && formData2.append('mother_phone_number', values.mother_phone_number.split(' ').join(''));
    values.father_name && formData2.append('father_name', values.father_name);
    values.father_phone_number && formData2.append('father_phone_number', values.father_phone_number.split(' ').join(''));
    values.english_level && formData2.append('english_level', values.english_level);
    values.quit_reason && formData2.append('quit_reason', values.quit_reason);
    values.region && formData2.append("region", values.region);
    values.country && formData2.append('country', values.country);
    values.residance && formData2.append('residance', values.residance);
    values.passport_number && formData2.append("passport_number", values.passport_number);
    values.place_of_work && formData2.append("place_of_work", values.place_of_work);
    values.authority && formData2.append("authority", values.authority);
    values.date_of_issue && formData2.append("date_of_issue", formatDate(values.date_of_issue.toString()));
    values.date_of_expire && formData2.append("date_of_expire", formatDate(values.date_of_expire.toString()));
    typeof values.passport_scan === 'object' && values.passport_scan !== null && formData2.append("passport_scan", values.passport_scan, values.passport_scan.name);
    values.info_from && formData2.append('info_from', values.info_from);
    values.contract_amount && formData2.append('contract_amount', values.contract_amount);
    values.klass && formData2.append('klass', values.klass);

    values.category.forEach((item) => {
        formData2.append("category", item.id);
      });

    setLoading(true);
    updateStudentRequest(formData2, resetForm);
  }


  const statusOptions = [
    {
      id: 0,
      label: "Активный",
      value: "A"
    },
    {
      id: 1,
      label: "Ушел",
      value: "L"

    },
    {
      id: 2,
      label: "Окончил",
      value: "G"
    },
  ];

  const oblasts = [
    {
      id: 0,
      label: "Ыссык-Кульская",
      value: "IK",
    },
    {
      id: 1,
      label: "Чуйская",
      value: "CH",
    },
    {
      id: 2,
      label: "Нарынская",
      value: "NR",
    },
    {
      id: 3,
      label: "Таласская",
      value: "TS",
    },
    {
      id: 4,
      label: "Джалал-Абадская",
      value: "JL",
    },
    {
      id: 5,
      label: "Ошская",
      value: "OS",
    },
    {
      id: 6,
      label: "Баткенская",
      value: "BT",
    },
  ];

  const englishLevelOptions = [
    {
      id: 0,
      label: "Elementary",
      value: "E"
    },
    {
      id: 1,
      label: "Beginner",
      value: "B"

    },
    {
      id: 2,
      label: "Intermediate",
      value: "I"
    },
    {
      id: 3,
      label: "Advanced",
      value: "A"
    }
  ];

  const infoFromOptions = [
    {
      id: 0,
      label: "Знакомые",
      value: "A"
    },
    {
      id: 1,
      label: "Социальные сети",
      value: "SN"

    },
    {
      id: 2,
      label: "Google",
      value: "G"
    },
    {
      id: 3,
      label: "СМИ",
      value: "SM"
    },
    {
      id: 4,
      label: "Другое",
      value: "O"
    }
  ]

  const history = useHistory();

  const updateUserRequest = async (userData) => {
    try {
      const response = await axios.put(`users/${initialValues.user.id}/`, userData);
    } catch (error) {
      let isEmailError = error.response.data.email ?? false;
      if (isEmailError) {
        dispatch(stopLoading());
        addToast("Пользователь с таким основным email уже существует!", {
          appearance: "error",
          autoDismiss: true
        })
      } else {
        dispatch(stopLoading());
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      }
    }
  };

  const updateStudentRequest = async (userData, resetForm) => {
    try {
      const response = await axios.put(`/users/students/${studentId}/`, userData);
      addToast("Студент обновлен!", {
        appearance: "success",
        autoDismiss: true
      })
      resetForm()
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  };

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

  const onSubmit = (values, {resetForm}) => {
    appendUserData(values);
    appendStudentData(values, resetForm);
    setTimeout(() => {
        history.push(`/student/${studentId}`);
      }, 0);
  }

  const genderOptions = [
    { key: 'Мужчина', value: 'M' },
    { key: 'Женщина', value: 'F' }
  ]

  return (
    <Dashboard>
      {loading && <Loader />}
      { !initialValues ? <Loader /> :

        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 className="card-title">{`Редактировать ${(profileData && profileData.id) === +studentId ? 'профиля' : 'студента'}`}</h4>
                </div>
                <h6 className="card-subtitle">
                </h6>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  initialTouched={initialTouched}
                >
                  {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting, handleChange }) => (

                    <Form className="mt-4">

                      <img
                        className={style.img}
                        src={(() => {
                          try {
                            return touched.user.avatar
                              ? URL.createObjectURL(values.user.avatar)
                              : values.user.avatar || unknownUser;
                          } catch (e) {
                            return unknownUser;
                          }
                        })()}
                        alt="student-profile-img"
                      />

                      <ImageDropzone
                        text="Фото профиля"
                        name="user.avatar"
                        acceptedFiles={["image/*"]}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                      />
                      <FormikControl
                        control="input"
                        type="text"
                        label="*Email"
                        fullwidth="true"
                        className="mt-4"
                        name="user.email"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Имя"
                        name="user.first_name"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Фамилия"
                        name="user.last_name"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Номер телефона"
                        name="user.phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Второй номер телефона"
                        name="user.second_phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="День рождения"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="user.birth_date"
                      />

                      <FormikControl
                        control="radio"
                        label="*Пол"
                        name="user.gender"
                        options={genderOptions}
                        color="primary"
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Инстаграм"
                        name="user.instagram"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Фейсбук"
                        name="user.facebook"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Linkedin"
                        name="user.linkedin"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Имя пользователя в Telegram"
                        name="user.telegram"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="user.branch"
                        label="Выберите филиал"
                        placeholder="Выберите филиал"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        defaultValue={values.user.branch}
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={branches}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Дата зачисления"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="enrollment_date"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Начало обучения"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="study_start_date"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Конец обучения"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="finish_date"
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="status"
                        label="Выберите статус"
                        placeholder="Выберите статус"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        defaultValue={values.status}
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={statusOptions}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Адрес проживания"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="address"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Адрес прописки"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="residence_address"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="ФИО матери"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="mother_name"
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Номер телефона матери"
                        name="mother_phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="ФИО отца"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="father_name"
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Номер телефона отца"
                        name="father_phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                      />


                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="english_level"
                        label="Уровень английского"
                        placeholder="Уровень английского"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        defaultValue={values.english_level}
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={englishLevelOptions}
                        handleChange={handleChange}
                      />



                      <FormikControl
                        control="input"
                        type="text"
                        label="Причина ухода"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="quit_reason"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Страна проживания"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="country"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="region"
                        label="Выберите область"
                        placeholder="Выберите область"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        defaultValue={values.region}
                        options={oblasts}
                        handleChange={handleChange}
                      />


                      <FormikControl
                        control="input"
                        type="text"
                        label="Гражданство"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="residence"
                        as={TextField}
                      />


                      <FormikControl
                        control="input"
                        type="text"
                        label="Номер пасспорта"
                        name="passport_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Кем выдан?"
                        name="authority"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Дата выдачи"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="date_of_issue"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Срок действия"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="date_of_expire"
                      />

                      <ImageDropzone
                        text="Скан пасспорта"
                        acceptedFiles={[""]}
                        name="passport_scan"
                        setFieldValue={setFieldValue}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Место работы после выпуска"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="place_of_work"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="info_from"
                        label="Откуда узнал?"
                        placeholder="Откуда узнал?"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        defaultValue={values.info_from}
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={infoFromOptions}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Остаток суммы контракта"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="contract_amount"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="klass"
                        label="Класс?"
                        placeholder="Класс студента"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        defaultValue={values.klass}
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={fetchedKlasses}
                        handleChange={handleChange}
                      />

                      <Field
                        name="category"
                        multiple
                        component={Autocomplete}
                        options={fetchedCategories}
                        style={{ width: "99%" }}
                        getOptionLabel={(option) =>
                          option.title
                        }
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            error={
                              touched["category"] && !!errors["category"]
                            }
                            helperText={
                              touched["category"] && errors["category"]
                            }
                            label="Выберите категории студента"
                            variant="outlined"
                            style={{ margin: 4 }}
                            className="mt-4"
                          />
                        )}
                      />

                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        style={{ margin: 4 }}
                        className="mt-4"
                      >
                        Изменить
                      </Button>


                      <FormikErrorFocus
                        offset={0}
                        align={'top'}
                        focusDelay={100}
                        ease={'linear'}
                        duration={700}
                      />
                      {/* <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>
      }
    </Dashboard>
  );
}
export default UpdateUser;

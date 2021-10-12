import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import Dashboard from "../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../axios/configuratedAxios";
import {
  Typography,
} from "@material-ui/core";
import Loader from "../../components/UI/Loader/Loader";
import { startLoading, getUserId, stopLoading } from "../../redux/actions/createUser";
import { useToasts } from 'react-toast-notifications';
import { Button } from '@material-ui/core'

function UpdateUser(props) {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dispatch = useDispatch();
  const { addToast } = useToasts()

  const [initialValues, setInitialValues] = useState(null);

  const userId = props.id;

  async function fetchAdminListDetail() {
    try {
      const response = await axios.get(`/users/${userId}`);
      setInitialValues(response.data);
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }
  useEffect(() => {
    fetchAdminListDetail()
  }, [])

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Неверный формат, введите валидный email")
      .required("Обязательное поле!"),
    academy_email: Yup.string().email("Неверный формат, введите валидный email"),
    phone_number: Yup.string(),
    gender: Yup.string().required("Обязательное поле!"),
  });

  const createUserRequest = async (userData) => {
    try {
      const response = await axios.put(`users/${userId}/`, userData);
      dispatch(getUserId(response.data.profile_id));
      alert(response.data.profile_id)
      addToast("Первый шаг выполнен!", {
        appearance: "success",
        autoDismiss: true
      })
      dispatch(stopLoading());
      props.setFirstStep(false);
    } catch (error) {
      console.log(error.response)
      if (error.response.data.email) {
        dispatch(stopLoading());
        addToast("Пользователь с таким основным email уже существует!", {
          appearance: "error",
          autoDismiss: true
        })
      } else {
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      }
    }
  }

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

  const onSubmit = (values, actions) => {
    values.birth_date = formatDate(values.birth_date);
    values.phone_number = values.phone_number.split(' ').join('');
    values.second_phone_number = values.phone_number.split(' ').join('');

    switch (props.userType) {
      case 'admin':
        values.is_administrator = true;
        break;
      case 'teacher':
        values.is_trainer = true;
        break;
      case 'student':
        values.is_student = true;
        break;
      case 'staff':
        values.is_staff_member = true;
        break;
      default:
        break;
    }
    dispatch(startLoading());
    createUserRequest(values);
    actions.resetForm();
  }

  const genderOptions = [
    { key: 'Мужчина', value: 'M' },
    { key: 'Женщина', value: 'F' }
  ]

  return (
    <Dashboard>

      { !initialValues ? <Loader /> :
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 className="card-title">Редактировать администратора</h4>
                  <Typography
                    color="primary"
                    component="p"
                    className="mt-2"
                    style={{ margin: 4 }}
                  >
                    Шаг 1
                  </Typography>
                </div>
                <h6 className="card-subtitle">
                </h6>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, isSubmitting }) => (

                    <Form className="mt-4">
                      <FormikControl
                        control="input"
                        type="text"
                        label="*Email"
                        fullwidth="true"
                        name="email"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Email Академии"
                        className="mt-4"
                        name="academy_email"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Имя"
                        name="first_name"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Фамилия"
                        name="last_name"
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
                        name="phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Второй номер телефона"
                        name="second_phone_number"
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
                        name="birth_date"
                      />

                      <FormikControl
                        control="radio"
                        label="*Пол"
                        name="gender"
                        options={genderOptions}
                        color="primary"
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Инстаграм"
                        name="instagram"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Фейсбук"
                        name="facebook"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Linkedin"
                        name="linkedin"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Имя пользователя в Telegram"
                        name="telegram"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ margin: 4 }}
                        className="mt-4"
                      >
                        Изменить
                      </Button>

                      <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>}
    </Dashboard>
  );
}

export default UpdateUser;

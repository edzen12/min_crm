import React, { useState, useEffect } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import Loader from "../../../components/UI/Loader/Loader";
import { TextField } from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import { useToasts } from "react-toast-notifications";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {fetchBranches, setBreadcrumbs} from "../../../redux/actions/index";
import ImageDropzone from "../../../components/UI/ImageDropzone/ImageDropzone";
import unknownUser from "../../../images/unknownUsers.png";
import style from "../AdminDetail/admin.module.css";
import { useHistory } from "react-router-dom";
import { stopLoading } from "../../../redux/actions/createUser";
import { Button } from '@material-ui/core'

function EditAdmin(props) {
  const [initialValues, setInitialValues] = useState(null);
  const profileData = useSelector(
    (state) => state.personalData.profileData.data
  );

  const dispatch = useDispatch();
  const initialTouched = {
    user: {
      avatar: false,
    },
  };

  useEffect(() => {
    fetchAdminDetail().then(() => {});
    window.scrollTo(0, 0);
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    initialValues && dispatch(setBreadcrumbs(
      [
        {title: "Администраторы", to: "/adminsList"},
        {title: initialValues.user.email, to: ""},
      ]
    ))
  }, [initialValues]);

  const dispatchedBranches = useSelector(
    (state) => state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches
    ? (dispatchedBranches.results || []).map((branch) => ({
        id: branch.id,
        value: branch.id,
        label: branch.name,
      }))
    : [];
  const [loading, setLoading] = useState(false);
  const userId = props.match.params.id;

  const { addToast } = useToasts();

  const validationSchema = Yup.object({
    passport_number: Yup.string().max(20, 'Не больше 20 символов!').nullable(),
    authority: Yup.string().max(10, 'Не больше 10 символов!').nullable(),
  });

  async function fetchAdminDetail() {
    try {
      const response = await axios.get(`users/administrators/${userId}/`);
      setInitialValues(response.data);
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  const patchAdmin = async (userData, resetForm) => {
    try {
      const response = await axios.put(
        `users/administrators/${initialValues.id}/`,
        userData
      );
      resetForm();
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const history = useHistory();

  const updateUserRequest = async (userData) => {
    try {
      const response = await axios.put(
        `users/${initialValues.user.id}/`,
        userData
      );
      addToast("Администратор обновлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      if (response.data) {
        setTimeout(() => {
          history.push(`/adminDetail/${userId}`);
        }, 0);
      }
      setLoading(false);
    } catch (error) {
      let isEmailError = error.response.data.email ?? false;
      if (isEmailError) {
        dispatch(stopLoading());
        addToast("Пользователь с таким основным email уже существует!", {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        dispatch(stopLoading());
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const appendUserData = (values) => {
    const formData1 = new FormData();
    values.user.email && formData1.append("email", values.user.email);
    values.user.avatar &&
      typeof values.user.avatar !== "string" &&
      formData1.append("avatar", values.user.avatar, values.user.avatar.name);
    values.user.first_name &&
      formData1.append("first_name	", values.user.first_name);
    values.user.last_name &&
      formData1.append("last_name	", values.user.last_name);
    values.user.phone_number &&
      formData1.append(
        "phone_number	",
        values.user.phone_number.split(" ").join("")
      );
    values.user.second_phone_number &&
      formData1.append(
        "second_phone_number	",
        values.user.second_phone_number.split(" ").join("")
      );
    values.user.birth_date &&
      formData1.append(
        "birth_date",
        formatDate(values.user.birth_date.toString())
      );
    values.user.gender && formData1.append("gender	", values.user.gender);
    values.user.instagram &&
      formData1.append("instagram	", values.user.instagram);
    values.user.facebook && formData1.append("facebook	", values.user.facebook);
    values.user.linkedin && formData1.append("linkedin	", values.user.linkedin);
    values.user.telegram && formData1.append("telegram", values.user.telegram);
    values.user.branch && formData1.append("branch", values.user.branch);
    formData1.append("is_administrator", true);
    updateUserRequest(formData1);
  };

  const appendAdminData = (values, resetForm) => {
    let formData = new FormData();
    values.cv &&
      typeof values.cv !== "string" &&
      formData.append("cv", values.cv, values.cv.name);
    values.salary && formData.append("salary", values.salary);
    values.contract &&
      typeof values.contract !== "string" &&
      formData.append("contract", values.contract, values.contract.name);
    values.passport_number &&
      formData.append("passport_number", values.passport_number);
    values.authority && formData.append("authority", values.authority);
    values.date_of_issue &&
      formData.append("date_of_issue", formatDate(values.date_of_issue));
    values.date_of_expire &&
      formData.append("date_of_expire", formatDate(values.date_of_expire));
    values.passport_scan &&
      typeof values.passport_scan !== "string" &&
      formData.append(
        "passport_scan",
        values.passport_scan,
        values.passport_scan.name
      );

    patchAdmin(formData, resetForm);
  };

  const onSubmit = (values, actions) => {
    appendUserData(values);
    appendAdminData(values);
    actions.resetForm();
    props.setFirstStep(true);
  };

  const genderOptions = [
    { key: "Мужчина", value: "M" },
    { key: "Женщина", value: "F" },
  ];

  return (
    <Dashboard>
      {loading && <Loader />}
      <motion.div
        layoutId="outline"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ easeInOut: [0, 0.02, 0.58, 1], duration: 1 }}
      >
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h4 className="card-title">{`Редактирование ${
                    (profileData && profileData.id) === +userId
                      ? "профиля"
                      : "администратора"
                  }`}</h4>
                </div>
                <h6 className="card-subtitle"></h6>

                {initialValues ? (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    initialTouched={initialTouched}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      setFieldTouched,
                      setFieldValue,
                      isSubmitting,
                      handleChange,
                    }) => (
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
                          alt="admin-profile-img"
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
                          className="mt-4"
                          label="*Email"
                          fullwidth="true"
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
                          defaultValue={values ? values.user.branch : null}
                          select
                          displayEmpty
                          fullwidth="true"
                          className="mt-5"
                          style={{ margin: 4 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          options={branches}
                          handleChange={handleChange}
                        />

                        <ImageDropzone
                          text="Резюме"
                          acceptedFiles={[""]}
                          name="cv"
                          setFieldValue={setFieldValue}
                        />

                        <FormikControl
                          control="input"
                          type="text"
                          label="Зарплата (в USD)"
                          name="salary"
                          className="mt-4"
                          fullwidth="true"
                          style={{ margin: 4 }}
                          as={TextField}
                        />

                        <ImageDropzone
                          text="Контракт"
                          acceptedFiles={[""]}
                          name="contract"
                          setFieldValue={setFieldValue}
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
                          ащите
                          файл
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

                        <Button
                          type="submit"
                          color="primary"
                          variant="contained"
                          style={{ margin: 4 }}
                          className="mt-4"
                        >
                          Изменить
                        </Button>
                        {/*<pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 2)}</pre>*/}
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        </Row>
      </motion.div>
    </Dashboard>
  );
}

export default EditAdmin;

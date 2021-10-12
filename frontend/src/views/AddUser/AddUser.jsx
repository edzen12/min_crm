import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux'
import Dashboard from "../../layouts/Dashboard/Dashboard";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Button, Row} from "reactstrap";
import FormikControl from "../../components/FormikControl";
import {TextField} from "@material-ui/core";
import axios from "../../axios/configuratedAxios";
import {
  Typography
} from "@material-ui/core";
import Loader from "../../components/UI/Loader/Loader";
import {startLoading, getUserId, stopLoading} from "../../redux/actions/createUser";
import {useToasts} from 'react-toast-notifications';
import {motion} from "framer-motion";
import FormikErrorFocus from 'formik-error-focus';
import ImageDropzone from "../../components/UI/ImageDropzone/ImageDropzone";
import {clearBreadcrumbs, fetchBranches, setBreadcrumbs} from "../../redux/actions";

function AddUser(props) {

  const [heading, setHeading] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    switch (props.userType) {
      case 'admin':
        setHeading('Добавить администратора')
        break;
      case 'teacher':
        setHeading('Добавить ментора')
        break;
      case 'student':
        setHeading('Добавить студента')
        break;
      case 'staff':
        setHeading('Добавить персонал')
        break;
      default:
        break;
    }
  }, [])

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.userCreate.loading);

  useEffect(() => {
    dispatch(fetchBranches())
  }, [dispatch]);

  const dispatchedBranches = useSelector(
    (state) =>
      state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches ? (dispatchedBranches.results || []).map(branch => ({
    id: branch.id,
    value: branch.id,
    label: branch.name
  })) : [];

  const {addToast} = useToasts()

  const initialValues = {
    email: "",
    first_name: "",
    last_name: "",
    avatar: null,
    phone_number: "",
    second_phone_number: "",
    birth_date: null,
    gender: "M",
    instagram: "",
    facebook: "",
    linkedin: "",
    telegram: "",
    is_trainer: false,
    is_staff_member: false,
    is_administrator: false,
    is_student: false,
    branch: ""
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Неверный формат, введите валидный email")
      .required("Обязательное поле!"),
    first_name: Yup.string().required('Обязательное поле!'),
    last_name: Yup.string().required('Обязательное поле!'),
    phone_number: Yup.string(),
    second_phone_number: Yup.string(),
    gender: Yup.string().required("Обязательное поле!"),
    branch: Yup.string().required("Обязательное поле!")
  });

  const createUserRequest = async (formData, resetForm) => {
    try {
      const response = await axios.post('users/', formData);
      dispatch(getUserId(response.data.profile_id));
      addToast("Первый шаг выполнен!", {
        appearance: "success",
        autoDismiss: true
      })
      resetForm()
      dispatch(stopLoading());
      dispatch(clearBreadcrumbs());

      props.userType === 'admin' ? dispatch(setBreadcrumbs([{title: "Админ-ы", to: "/adminsList"}, {
          title: "Шаг-1",
          to: "", disabled: true
        },
          {
            title: "Шаг-2",
            to: ""
          }
        ])) :
        props.userType === 'teacher' ? dispatch(setBreadcrumbs([{
            title: "Менторы",
            to: "/trainersList"
          }, {title: "Шаг-1", to: "", disabled: true},
            {
              title: "Шаг-2",
              to: ""
            }])) :
          props.userType === 'staff' ? dispatch(setBreadcrumbs([{
              title: "Сотрудники",
              to: "/staffMembersList"
            }, {title: "Шаг-1", to: "", disabled: true},
              {
                title: "Шаг-2",
                to: ""
              }]))
            : dispatch(setBreadcrumbs([{title: "Студенты", to: "/studentsList"}, {title: "Шаг-1", to: "", disabled: true},
              {
                title: "Шаг-2",
                to: ""
              }]))

      props.setFirstStep(false);
    } catch (error) {
      console.log(error.response)
      let isEmailError = error.response.data.email ?? false;
      if (isEmailError) {
        dispatch(stopLoading());
        addToast(isEmailError[0], {
          appearance: "error",
          autoDismiss: true
        })
      } else if (
        error.response.data.linkedin ||
        error.response.data.telegram ||
        error.response.data.facebook ||
        error.response.data.instagram
      ) {
        dispatch(stopLoading());
        addToast("Неверная ссылка на соц. сеть!", {
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

  let formData = new FormData();
  const onSubmit = (values, {resetForm}) => {
    values.email && formData.append('email', values.email);
    values.first_name && formData.append('first_name', values.first_name);
    values.last_name && formData.append('last_name', values.last_name);
    values.gender && formData.append('gender', values.gender);
    values.instagram && formData.append('instagram', values.instagram);
    values.facebook && formData.append('facebook', values.facebook);
    values.linkedin && formData.append('linkedin', values.linkedin);
    values.telegram && formData.append('telegram', values.telegram);
    values.gender && formData.append('gender', values.gender);
    values.birth_date && formData.append('birth_date', formatDate(values.birth_date));
    values.phone_number && formData.append('phone_number', values.phone_number.split(' ').join(''));
    values.second_phone_number && formData.append('second_phone_number', values.second_phone_number.split(' ').join(''));
    values.branch && formData.append('branch', values.branch);

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

    values.is_administrator && formData.append('is_administrator', values.is_administrator);
    values.is_trainer && formData.append('is_trainer', values.is_trainer);
    values.is_student && formData.append('is_student', values.is_student);
    values.is_staff_member && formData.append('is_staff_member', values.is_staff_member);
    values.avatar && formData.append("avatar", values.avatar, values.avatar.name);

    dispatch(startLoading());
    createUserRequest(formData, resetForm);
  }

  const genderOptions = [
    {key: 'Мужчина', value: 'M'},
    {key: 'Женщина', value: 'F'}
  ]

  return (
    <Dashboard>

      {isLoading && <Loader/>}

      <motion.div
        layoutId="outline"
        initial={{x: "-100%"}}
        animate={{x: 0}}
        transition={{easeInOut: [0, .02, .58, 1], duration: 1}}
      >
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <h4 className="card-title">{heading}</h4>
                  <Typography
                    color="primary"
                    component="p"
                    className="mt-2"
                    style={{margin: 4}}
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
                  {({values, errors, isSubmitting, setFieldValue, handleChange}) => (

                    <Form className="mt-4">
                      <FormikControl
                        control="input"
                        type="text"
                        label="*Email"
                        fullwidth="true"
                        name="email"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Имя"
                        name="first_name"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Фамилия"
                        name="last_name"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <ImageDropzone
                        text="Фото профиля"
                        name="avatar"
                        acceptedFiles={["image/*"]}
                        setFieldValue={setFieldValue}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Номер телефона"
                        name="phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Второй номер телефона"
                        name="second_phone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="День рождения"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
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
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Фейсбук"
                        name="facebook"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Linkedin"
                        name="linkedin"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Имя пользователя в Telegram"
                        name="telegram"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      {branches ? (
                        <FormikControl
                          control="select"
                          component={TextField}
                          type="text"
                          name="branch"
                          label="Выберите филиал"
                          placeholder="Выберите филиал"
                          select
                          displayEmpty
                          fullwidth="true"
                          className="mt-5"
                          style={{margin: 4}}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          options={branches}
                          handleChange={handleChange}
                        />

                      ) : (
                        <p>loading...</p>
                      )}

                      <Button
                        type="submit"
                        style={{margin: 4, backgroundColor: '#3f51b5'}}
                        className="mt-4"
                      >
                        Следующий шаг
                      </Button>
                      {/*<pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>*/}
                      {/*<pre>{JSON.stringify(errors, null, 2)}</pre>*/}
                      <FormikErrorFocus
                        offset={0}
                        align={'top'}
                        focusDelay={100}
                        ease={'linear'}
                        duration={700}
                      />

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>
      </motion.div>
    </Dashboard>
  );
}

export default AddUser;

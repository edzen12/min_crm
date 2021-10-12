import React from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  fetchUsers, setBreadcrumbs,
} from "../../../redux/actions";
import {
  TextField,
  Typography,
} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import FormikErrorFocus from 'formik-error-focus'
import axios from "../../../axios/configuratedAxios";
import Loader from "../../../components/UI/Loader/Loader";
import { useToasts } from 'react-toast-notifications';

function AddBranch() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbs(
      [
        {title: "Филиалы", to: "/branches"},
        {title: "Создать филиал", to: ""},
      ]
    ))
    dispatch(fetchUsers('users/trainers', 'trainers'));
    dispatch(fetchUsers("users/administrators", "admins"));
    dispatch(fetchUsers("users/staff-members", "staffMembers"));
    dispatch(fetchUsers('users/students', 'students'));
    dispatch(fetchCourses());
  }, []);

  const [isLoading, setLoading] = useState(false)

  const dispatchedCourses = useSelector(
    (state) => state.courses.courses.data
  );

  const course = dispatchedCourses
    ? (dispatchedCourses.results || []).map((course) => ({
        id: course.id,
        value: course.id,
        label: course.title,
      }))
    : [];


  const { addToast } = useToasts();

  const initialValues = {
    name: "",
    oblast: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    description: "",
    bases: []
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Это обязательное поле!"),
    oblast: Yup.string().required("Это обязательное поле!"),
    city: Yup.string().required("Это обязательное поле!"),
    address: Yup.string().required("Это обязательное поле!"),
    email: Yup.string()
      .email("Неверный формат, введите валидный email")
      .required("Обязательное поле!"),
    phone: Yup.string().required("Обязательное поле!"),
    description: Yup.string().required("Обязательное поле!"),
  });

  const createKlass = async (formData, resetForm) => {
    try {
      setLoading(true);
      const response = await axios.post('branches/', formData);
      setLoading(false);
      resetForm();
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })

      let isEmailError = error.response.data.email ?? false;
      if (isEmailError) {
        setLoading(false)
        addToast("Филиал с таким email уже существует!", {
          appearance: "error",
          autoDismiss: true
        })
      } else {
        setLoading(false)
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      }
      console.log(error)
    }
  }

  let formData = new FormData();
  const onSubmit = (values, { resetForm }) => {
    setLoading(true);
    values.name && formData.append("name", values.name);
    values.oblast && formData.append("oblast", values.oblast);
    values.city && formData.append("city", values.city);
    values.address && formData.append("address", values.address);
    values.email && formData.append("email", values.email);
    values.description && formData.append("description", values.description);
    values.phone && formData.append("telephone_number", values.phone.split(' ').join(''));
    values.bases && values.bases.forEach(r => {
      if (r === "9") {
        formData.append("class9", true);
      } else if (r === "10") {
        formData.append("class10", true);
      } else if (r === "11") {
        formData.append("class11", true);
      }
    });


    createKlass(formData, resetForm);
    addToast("Филиал добавлен!", {
      appearance: "success",
      autoDismiss: true
    })
    setTimeout(() => {
      window.location = `/branches`
    }, 1000);
  };

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

  const optionsHelper = [];
  const basesOptions = [
    { key: '9-класс', value: '9' },
    { key: '10-класс', value: '10' },
    { key: '11-класс', value: '11' },
  ]

  return (
    <Dashboard>
      {isLoading && <Loader />}
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 className="card-title">Создать филиал</h4>
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, isSubmitting, touched, handleChange, resetForm, setFieldValue }) => (
                    <Form className="mt-4">

                      <FormikControl
                        control="input"
                        type="text"
                        label="Название"
                        placeholder="Название"
                        name="name"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="oblast"
                        label="Выберите область"
                        placeholder="Выберите область"
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={oblasts}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Город или населенный пункт"
                        placeholder="Город или населенный пункт"
                        name="city"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Адресс"
                        placeholder="Адресс"
                        name="address"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Email"
                        placeholder="Email"
                        name="email"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Номер телефона"
                        name="phone"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Описание"
                        placeholder="Описание"
                        name="description"
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        multiline
                        rows={8}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="checkbox"
                        type="text"
                        label="Образование (класс)"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        options={basesOptions}
                        arrayHelper={optionsHelper}
                        name="bases"
                        color="primary"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        style={{ margin: 4 }}
                      >
                        Создать
                      </Button>

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
      </div>
    </Dashboard>
  );
}

export default AddBranch;

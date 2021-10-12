import React, {useEffect} from "react";
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
import {useToasts} from 'react-toast-notifications';
import {startLoading, stopLoading} from "../../redux/actions/createUser";
import {motion} from "framer-motion";
import ImageDropzone from "../../components/UI/ImageDropzone/ImageDropzone";
import {useHistory} from "react-router-dom";

function AddAdmin(props) {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dispatch = useDispatch();
  const userId = useSelector(state => state.userCreate.userId);
  const isLoading = useSelector(state => state.userCreate.loading);
  const {addToast} = useToasts();

  const initialValues = {
    cv: null,
    salary: "",
    contract: null,
    passportNumber: "",
    authority: "",
    dateOfIssue: null,
    dateOfExpire: null,
    passportScan: null,
  };

  const validationSchema = Yup.object({
    passportNumber: Yup.string().max(20, 'Не больше 20 символов!').nullable(),
    authority: Yup.string().max(10, 'Не больше 10 символов!').nullable(),
  });

  let formData = new FormData();
  const history = useHistory();

  const putAdmin = async (formData, resetForm) => {
    try {
      const response = await axios.put(`users/administrators/${userId}/`, formData);
      addToast("Администратор добавлен!", {
        appearance: "success",
        autoDismiss: true
      })

      if (response.data) {
        props.setFirstStep(true);
        setTimeout(() => {
          history.push(`/adminDetail/${response.data.id}`);
        }, 1000);
      }

      dispatch(stopLoading());
      resetForm();
      return response.data.id;
    } catch (error) {
      dispatch(stopLoading());
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
      return null;
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

  const onSubmit = async (values, {resetForm}) => {
    values.cv && formData.append("cv", values.cv, values.cv.name);
    values.salary && formData.append("salary", values.salary);
    values.contract && formData.append("contract", values.contract, values.contract.name);
    values.passportNumber && formData.append("passport_number", values.passportNumber);
    values.authority && formData.append("authority", values.authority);
    values.dateOfIssue && formData.append("date_of_issue", formatDate(values.dateOfIssue));
    values.dateOfExpire && formData.append("date_of_expire", formatDate(values.dateOfExpire));
    values.passportScan && formData.append("passport_scan", values.passportScan, values.passportScan.name);

    dispatch(startLoading());
    putAdmin(formData, resetForm);
  }

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
                  <h4 className="card-title">Создать администратора</h4>
                  <Typography
                    color="primary"
                    component="p"
                    className="mt-2"
                    style={{margin: 4}}
                  >
                    Шаг 2
                  </Typography>
                </div>
                <h6 className="card-subtitle">
                </h6>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({values, errors, isSubmitting, setFieldValue}) => (
                    <Form className="mt-4">
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
                        style={{margin: 4}}
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
                        name="passportNumber"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Кем выдан"
                        name="authority"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Дата выдачи"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="dateOfIssue"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Срок действия"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="dateOfExpire"
                      />

                      <ImageDropzone
                        text="Скан пасспорта"
                        acceptedFiles={[""]}
                        name="passportScan"
                        setFieldValue={setFieldValue}
                      />

                      <Button
                        type="submit"
                        color="primary"
                        style={{margin: 4}}
                        className="mt-4"
                      >
                        Добавить
                      </Button>

                      {/*<pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>*/}
                      {/*<pre>{JSON.stringify(errors, null, 2)}</pre>*/}
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

export default AddAdmin;

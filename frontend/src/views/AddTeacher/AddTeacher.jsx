import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import Dashboard from "../../layouts/Dashboard/Dashboard";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Row} from "reactstrap";
import FormikControl from "../../components/FormikControl";
import {TextField} from "@material-ui/core";
import axios from "../../axios/configuratedAxios";
import {
  Typography
} from "@material-ui/core";
import {useToasts} from 'react-toast-notifications'
import {startLoading, stopLoading} from "../../redux/actions/createUser";
import ImageDropzone from "../../components/UI/ImageDropzone/ImageDropzone";
import {fetchKlasses} from "../../redux/actions";
import MultiSelectSearch from "../../components/MultiSelectSearch";
import {Button} from '@material-ui/core';

function AddTeacher(props) {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dispatch = useDispatch();
  const userId = useSelector(state => state.userCreate.userId);
  const [klassFetching, setKlassFetching] = useState(false);
  const [klassSearchValue, setKlassSearchValue] = useState('');

  const initialValues = {
    cv: null,
    salary: "",
    contract: null,
    passportNumber: "",
    authority: "",
    dateOfIssue: null,
    dateOfExpire: null,
    passportScan: null,
    responsobility: 'T',
    status: "W",
    github: "",
    portfolio: "",
    klasses: [],
  };

  const validationSchema = Yup.object({
    passportNumber: Yup.string().max(20, 'Не больше 20 символов!').nullable(),
    authority: Yup.string().max(10, 'Не больше 10 символов!').nullable(),
  });

  let formData = new FormData();

  const putTeacher = async (formData, resetForm) => {
    try {
      const response = await axios.put(`users/trainers/${userId}/`, formData);
      addToast("Ментор добавлен!", {
        appearance: "success",
        autoDismiss: true
      });
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

  useEffect(() => {
    setKlassFetching(true);
    dispatch(fetchKlasses(`klasses/?search=${klassSearchValue}`)
    ).then(() => setKlassFetching(false))
  }, [klassSearchValue]);

  const dispatchedKlasses = useSelector(
    (state) => state.klasses.klasses.data && state.klasses.klasses.data
  );

  const klasses = dispatchedKlasses ? (dispatchedKlasses.results || []).map(klass => ({
    id: klass.id,
    value: klass.id,
    label: klass.klass_id
  })) : [];

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

  const {addToast} = useToasts();
  const onSubmit = async (values, {resetForm}) => {
    values.cv && formData.append("cv", values.cv);
    values.salary && formData.append("salary", values.salary);
    values.contract && formData.append("contract", values.contract);
    values.passportNumber && formData.append("passport_number", values.passportNumber);
    values.authority && formData.append("authority", values.authority);
    values.dateOfIssue && formData.append("date_of_issue", formatDate(values.dateOfIssue));
    values.dateOfExpire && formData.append("date_of_expire", formatDate(values.dateOfExpire));
    values.passportScan && formData.append("passport_scan", values.passportScan);

    if (values.responsobility === "T") {
      formData.append("is_trainer", true);
    } else {
      formData.append("is_assistant", true);
    }
    values.status && formData.append("status", values.status);

    values.github && formData.append("github", values.github);
    values.portfolio && formData.append("portfolio", values.portfolio);

    dispatch(startLoading());
    const personId = await putTeacher(formData, resetForm);
    if (personId) {
      props.setFirstStep(true);
      setTimeout(() => {
        window.location = `trainersList/`
      }, 1000);
    }
  }
  const statusOptions = [
    {key: 'Работает', value: 'W'},
    {key: 'Не работает', value: 'L'}
  ]

  const responsobilityOptions = [
    {key: 'Тренер', value: 'T'},
    {key: 'Ассистент', value: 'A'}
  ]

  return (
    <Dashboard>
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <h4 className="card-title">Добавить ментора</h4>
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
                  {({touched, errors, isSubmitting, setFieldValue}) => (
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

                      <FormikControl
                        control="radio"
                        label="Позиция"
                        name="responsobility"
                        options={responsobilityOptions}
                        color="primary"
                      />

                      <FormikControl
                        control="radio"
                        label="Выберите статус"
                        name="status"
                        options={statusOptions}
                        color="primary"
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Github"
                        fullwidth="true"
                        name="github"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <MultiSelectSearch
                        name="klasses"
                        options={klasses}
                        getOptionLabel={(option) => option.label ? option.label : ""}
                        label="Выберите классы"
                        touched={touched}
                        errors={errors}
                        loading={klassFetching}
                        onChange={(e) => setKlassSearchValue(e.target.value)}
                        value={klassSearchValue}
                        onBlur={() => setKlassSearchValue('')}
                        multiple={true}
                      />

                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
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
      </div>
    </Dashboard>
  );
}

export default AddTeacher;

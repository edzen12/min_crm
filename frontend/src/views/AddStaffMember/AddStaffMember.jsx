import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import Dashboard from "../../layouts/Dashboard/Dashboard";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Row} from "reactstrap";
import FormikControl from "../../components/FormikControl";
import {TextField} from "@material-ui/core";
import axios from "../../axios/configuratedAxios";
import {useToasts} from 'react-toast-notifications'
import {startLoading, stopLoading} from "../../redux/actions/createUser";
import ImageDropzone from "../../components/UI/ImageDropzone/ImageDropzone";
import {Button} from 'reactstrap'

function AddStaffMember() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const dispatch = useDispatch();
  const userId = useSelector(state => state.userCreate.userId);
  const {addToast} = useToasts();

  const responsibilityOptions = [
    {key: 'Отдел кадров', value: 'is_hr'},
    {key: 'Отдел финансов', value: 'is_finance'},
    {key: 'Отдел маркетинга', value: 'is_marketing'},
    {key: 'Отдел продажи', value: 'is_sales'},
  ]

  const optionsHelper = [];

  const initialValues = {
    cv: null,
    salary: "",
    contract: null,
    passportNumber: "",
    authority: "",
    dateOfIssue: null,
    dateOfExpire: null,
    passportScan: null,
    responsibility: [],
    status: "W",
  };

  const validationSchema = Yup.object({
    passportNumber: Yup.string().max(20, 'Не больше 20 символов!'),
    authority: Yup.string().max(10, 'Не больше 10 символов!'),
    dateOfIssue: Yup.date().nullable(),
    dateOfExpire: Yup.date().nullable(),
  });

  const patchStaffMember = async (formData, resetForm) => {
    try {
      dispatch(startLoading());
      const response = await axios.put(`users/staff-members/${userId}/`, formData);
      addToast("Персонал добавлен!", {
        appearance: "success",
        autoDismiss: true
      })
      resetForm();
      return response.data.id
    } catch (error) {
      dispatch(stopLoading());
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
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

  const onSubmit = async (values, {resetForm}) => {
    values.cv && formData.append("cv", values.cv);
    values.salary && formData.append("salary", values.salary);
    values.contract && formData.append("contract", values.contract);
    values.passportNumber && formData.append("passport_number", values.passportNumber);
    values.authority && formData.append("authority", values.authority);
    values.dateOfIssue && formData.append("date_of_issue", formatDate(values.dateOfIssue));
    values.dateOfExpire && formData.append("date_of_expire", formatDate(values.dateOfExpire));
    values.passportScan && formData.append("passport_scan", values.passportScan);
    values.responsibility && values.responsibility.forEach(item => {
      formData.append(item, true);
    })
    values.status && formData.append("status", values.status);

    const personId = await patchStaffMember(formData, resetForm);
    if (personId) {
      setTimeout(() => {
        window.location = `staffMember/${personId}`
      }, 1000);
    }
  }

  const statusOptions = [
    {key: 'Работает', value: 'W'},
    {key: 'Не работает', value: 'L'}
  ]

  return (
    <Dashboard>
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Создать персонал</h4>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({isSubmitting, setFieldValue}) => (
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
                        text="Скан пасспорта"
                        acceptedFiles={[""]}
                        name="passportScan"
                        setFieldValue={setFieldValue}
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

                      <ImageDropzone
                        text="Контракт"
                        acceptedFiles={[""]}
                        name="contract"
                        setFieldValue={setFieldValue}
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

                      <FormikControl
                        control="checkbox"
                        type="text"
                        label="Сферы деятельности"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        options={responsibilityOptions}
                        arrayHelper={optionsHelper}
                        name="responsibility"
                        color="primary"
                      />

                      <FormikControl
                        control="radio"
                        label="Выберите статус"
                        name="status"
                        options={statusOptions}
                        color="primary"
                      />

                      <Button
                        type="submit"
                        color="primary"
                        style={{margin: 4}}
                        className="mt-4"
                      >
                        Добавить
                      </Button>

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

export default AddStaffMember;